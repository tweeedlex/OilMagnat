const { Router } = require("express");
const ApiError = require("../../../../exceptions/api-error");
const authMiddleware = require("../../../../middlewares/authMiddleware");

// get current derrick level
module.exports = Router({ mergeParams: true }).get("/upgrade/derrick", authMiddleware, async (req, res, next) => {
	try {
		const { db } = req;
		const tgId = req.user.id;
		let userLocationsModel = db.Locations;
		let userModel = db.User;

		let user = await userModel.findOne({ tgId });

		if (!user) {
			throw res.status(404).json("User not found");
		}

		let userLocations = await userLocationsModel.find(
			{ ownerTgId: tgId },
			{ derrickLevel: 1, locationNumber: 1, boughtAt: 1, isDerrickBought: 1 }
		);

		res.json({ userLocations });
	} catch (error) {
		console.error("Error while buying a derrick:", error);
		next(error);
	}
});
