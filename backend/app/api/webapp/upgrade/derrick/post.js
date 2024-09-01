const { Router } = require("express");
const ApiError = require("../../../../exceptions/api-error");
const authMiddleware = require("../../../../middlewares/authMiddleware");

module.exports = Router({ mergeParams: true }).post("/upgrade/derrick", authMiddleware, async (req, res, next) => {
	try {
		const { db } = req;
		const { derrickLocationNum } = req.body; // номер локації на якій юзер буде прокачувати вишку
		const tgId = req.user.id;
		let userLocationsModel = db.Locations;
		let userModel = db.User;

		if (!derrickLocationNum) {
			return next(ApiError.BadRequest("Missing required params"));
		}

		let user = await userModel.findOne({ tgId });

		if (!user) {
			return next(new ApiError(404, "User not found"));
		}

		let userLocation = await userLocationsModel.findOne({ ownerTgId: tgId, locationNumber: derrickLocationNum });
		if (!userLocation) {
			return next(ApiError.BadRequest("This location must be bought"));
		}
		if (!userLocation.isDerrickBought) {
			return next(ApiError.BadRequest("Derrick is not bought at this location"));
		}

		let upgradeCost = calculateUpgradeCost(userLocation.derrickLevel);

		if (user.balance < upgradeCost) {
			return next(new ApiError(404, "Insufficient balance for the derrick upgrade"));
		}

		const settings = await db.Settings.findOne();

		if (userLocation.derrickLevel >= settings.maxDerrickLevel) {
			return next(new ApiError(404, "Maximum derrick upgrade level reached"));
		}

		user.balance -= upgradeCost;
		userLocation.derrickLevel += 1;
		userLocation.derrickMiningRate = (userLocation.derrickMiningRate + 0.2).toFixed(2);
		userLocation.derrickDurabilityRate = getDerrickDurabilityRate(userLocation.derrickLevel);

		await user.save();
		await userLocation.save();

		res.json({ user, userLocation });
	} catch (error) {
		console.error("Error upgrading burger level:", error.message);
		next(error);
	}
});
function calculateUpgradeCost(upgradeLevel) {
	let upgradeCost = 650;

	switch (upgradeLevel) {
		case 1:
			upgradeCost = 1500;
			break;
		case 2:
			upgradeCost = 4500;
			break;
		case 3:
			upgradeCost = 13500;
			break;
		case 4:
			upgradeCost = 40500;
			break;
	}

	return parseFloat(upgradeCost.toFixed(0));
}

// У нефтекачек есть износ в зависимости от уровня,
// 1ур- 1,4% в час
// 2ур- 1,1% в час
// 3 ур- 0.9% в час
// 4ур- 0.6% в час
// 5 ур- 0.4% в час

function getDerrickDurabilityRate(derrickLevel) {
	let durabilityPercent = 1.4;
	switch (derrickLevel) {
		case 1:
			durabilityPercent = 1.4;
			break;
		case 2:
			durabilityPercent = 1.1;
			break;
		case 3:
			durabilityPercent = 1.9;
			break;
		case 4:
			durabilityPercent = 0.6;
			break;
		case 5:
			durabilityPercent = 0.4;
			break;
	}
	return durabilityPercent;
}
