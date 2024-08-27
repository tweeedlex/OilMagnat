const { Router } = require("express");
const authMiddleware = require("../../../../middlewares/adminMiddleware");
const ApiError = require("../../../../exceptions/api-error");

module.exports = Router({ mergeParams: true }).post("/upgrade/burger", authMiddleware, async (req, res, next) => {
	try {
		const { db } = req;
		const { derrickLocationNum } = req.body;
		const tgId = req.user.id;
		let userLocationsModel = db.Locations;
		let userModel = db.User;

		let user = await userModel.findOne({ tgId });

		if (!user) {
			return res.status(404).json("User not found");
		}

		let userLocation = await userLocationsModel.findOne({ ownerTgId: tgId, locationNumber: derrickLocationNum });
		if (!userLocation) {
			return ApiError.BadRequest("This location must be bought");
		}
		if (!userLocation.isDerrickBought) {
			return ApiError.BadRequest("Derrick is not bought at this location");
		}

		let upgradeCost = calculateUpgradeCost(userLocation.derrickLevel);

		if (user.balance < upgradeCost) {
			return res.status(404).json("Insufficient balance for the burger upgrade");
		}

		const settings = await db.Settings.findOne();

		if (userLocation.derrickLevel >= settings.maxDerrickLevel) {
			return res.status(404).json("Maximum burger upgrade level reached");
		}

		user.balance -= upgradeCost;
		userLocation.derrickLevel += 1;
		userLocation.derrickMiningRate += 0.2;

		await user.save();
		await userLocation.save();

		res.json(user);
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
