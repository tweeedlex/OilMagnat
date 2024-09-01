// ? models
const SECONDS_INTERVAL = 10;

async function oilPumping(db) {
	const { User, Locations } = db;
	try {
		let startTime = new Date();
		let users = await User.aggregate([
			{
				$match: { isOilPumping: true },
			},
			{
				$lookup: {
					from: db.Locations.collection.collectionName,
					localField: "tgId",
					foreignField: "ownerTgId",
					as: "userLocations",
				},
			},
			{
				$unwind: "$userLocations",
			},
			{
				$match: { "userLocations.isDerrickBought": true, "userLocations.isDerrickAvailable": true },
			},
			{
				$group: {
					_id: "$_id",
					tgId: { $first: "$tgId" },
					isOilPumping: { $first: "$isOilPumping" },
					userLocations: { $push: "$userLocations" },
					notClaimedOil: { $first: "$notClaimedOil" },
					maxOilAmount: { $first: "$maxOilAmount" },
				},
			},
		]);

		let userBulkOps = [];
		let derricksBulkOps = [];

		for (const user of users) {
			if (user.notClaimedOil >= user.maxOilAmount) {
				userBulkOps.push({
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
				totalDerrickMined += derrick.derrickMiningRate / 360;
				let newDerrickDurability = derrick.derrickDurability - derrick.derrickDurabilityRate / 360;
				if (newDerrickDurability > 0) {
					derricksBulkOps.push({
						updateOne: {
							filter: { _id: derrick._id },
							update: { derrickDurability: newDerrickDurability },
						},
					});
				} else {
					derricksBulkOps.push({
						updateOne: {
							filter: { _id: derrick._id },
							update: { derrickDurability: 0, isDerrickAvailable: false },
						},
					});
				}
			}

			// Вычисляем максимальное значение, которое можно добавить
			const maxAddableOil = user.maxOilAmount - user.notClaimedOil;
			const oilToAdd = Math.min(totalDerrickMined, maxAddableOil);
			userBulkOps.push({
				updateOne: {
					filter: { _id: user._id },
					update: { $inc: { notClaimedOil: oilToAdd } },
				},
			});

			// Применяем пакетные обновления, если пакет достиг определенного размера
			if (userBulkOps.length >= 1000) {
				await User.bulkWrite(userBulkOps);
				userBulkOps = [];
				userBulkOps.length = 0;
			}
			if (derricksBulkOps.length >= 1000) {
				await Locations.bulkWrite(derricksBulkOps);
				derricksBulkOps = [];
				derricksBulkOps.length = 0;
			}
		}
		// Применяем оставшиеся обновления
		if (userBulkOps.length > 0) {
			await User.bulkWrite(userBulkOps);
		} // Применяем оставшиеся обновления
		if (derricksBulkOps.length > 0) {
			await Locations.bulkWrite(derricksBulkOps);
		}
		console.log(`job done ${startTime} - ${new Date()}`);
	} catch (error) {
		console.error("Error giving oil users:", error);
	}
}

const startOilPumping = async (db) => {
	await oilPumping(db);
	setInterval(() => oilPumping(db), SECONDS_INTERVAL * 1000);
};

module.exports = startOilPumping;
