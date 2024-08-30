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
				$match: { "userLocations.isDerrickBought": true }, // Фильтруем только те локации, у которых isDerrickBought: true
			},
			{
				$group: {
					_id: "$_id", // Группируем по ID пользователя
					tgId: { $first: "$tgId" }, // Сохраняем tgId пользователя
					isOilPumping: { $first: "$isOilPumping" }, // Сохраняем флаг isOilPumping
					userLocations: { $push: "$userLocations" }, // Собираем локации обратно в массив
				},
			},
		]);

		const bulkOps = [];

		for (const user of users) {
			if (user.maxOilAmount >= user.notClaimedOil) return;

			let userDerricks = user.userLocations;
			if (!userDerricks || userDerricks.length === 0) return;

			let totalDerrickMined = 0;

			for (const derrick of userDerricks) {
				if (derrick.derrickDurability == 0 || !derrick) return;
				// totalDerrickMined += derrick.derrickMiningRate;
			}
			console.log(totalDerrickMined);

			bulkOps.push({
				updateOne: {
					filter: { _id: user._id },
					update: { $inc: { notClaimedOil: totalDerrickMined } },
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
		// if (bulkOps.length > 0) {
		// 	await User.bulkWrite(bulkOps);
		// }
		// for (const user of users) {
		// 	if (user.maxOilAmount >= user.notClaimedOil) {
		// 		return;
		// 	}
		// 	let userDerricks = user.userLocations;
		// 	if (!userDerricks || userDerricks.length == 0) {
		// 		return;
		// 	}
		// 	let totalDerrickMined = 0;
		// 	for (const derrick of userDerricks) {
		// 		if (derrick.derrickDurability == 0) {
		// 			return;
		// 		}
		// 		totalDerrickMined += derrick.derrickMiningRate / 120;
		// 	}
		// 	user.notClaimedOil += totalDerrickMined;
		// }
	} catch (error) {
		console.error("Error giving oil users:", error);
	}
}
exports.oilPumping = oilPumping;
