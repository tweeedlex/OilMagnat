// ? models
const SECONDS_INTERVAL = 30;

async function oilPumping(db) {
	const { User } = db;
	try {
		let users = await User.aggregate([
			{
				$match: { isOilPumping: true }, // Фильтруем пользователей с isOilPumping: true
			},
			{
				$lookup: {
					from: db.Locations.collection.collectionName, // Коллекция локаций
					localField: "tgId", // Поле пользователя, по которому связываем
					foreignField: "ownerTgId", // Поле локации, по которому связываем
					as: "userLocations", // Имя нового поля с локациями
				},
			},
			{
				$unwind: "$userLocations", // Разворачиваем массив userLocations для фильтрации
			},
			{
				$match: { "userLocations.isDerrickBought": true }, // Фильтруем только те локации, у которых isDerrickBought: true
			},
			{
				$group: {
					_id: "$_id", // Группируем по ID пользователя
					tgId: { $first: "$tgId" }, // Сохраняем tgId пользователя
					isOilPumping: { $first: "$isOilPumping" }, // Сохраняем флаг isOilPumping
					userLocations: { $push: "$userLocations" }, // Собираем локации обратно в массив
					notClaimedOil: { $first: "$notClaimedOil" },
					maxOilAmount: { $first: "$maxOilAmount" },
				},
			},
		]);

		const bulkOps = [];

		for (const user of users) {
			if (user.notClaimedOil >= user.maxOilAmount) {
				bulkOps.push({
					updateOne: {
						filter: { _id: user._id },
						update: { isOilPumping: false },
					},
				});
				continue;
			}

			let userDerricks = user.userLocations;
			if (!userDerricks || userDerricks.length === 0) continue;

			let totalDerrickMined = 0;

			for (const derrick of userDerricks) {
				if (derrick.derrickDurability == 0 || !derrick) continue;
				totalDerrickMined += derrick.derrickMiningRate;
			}

			// Вычисляем максимальное значение, которое можно добавить
			const maxAddableOil = user.maxOilAmount - user.notClaimedOil;
			const oilToAdd = Math.min(totalDerrickMined, maxAddableOil);
			bulkOps.push({
				updateOne: {
					filter: { _id: user._id },
					update: { $inc: { notClaimedOil: oilToAdd } },
				},
			});

			// Применяем пакетные обновления, если пакет достиг определенного размера
			if (bulkOps.length >= 1000) {
				await User.bulkWrite(bulkOps);
				bulkOps = [];
				bulkOps.length = 0;
			}
		}
		// Применяем оставшиеся обновления
		if (bulkOps.length > 0) {
			await User.bulkWrite(bulkOps);
		}
	} catch (error) {
		console.error("Error giving oil users:", error);
	}
}

const startOilPumping = (db) => {
	oilPumping(db);
	setInterval(() => oilPumping(db), SECONDS_INTERVAL * 1000);
};

module.exports = startOilPumping;
