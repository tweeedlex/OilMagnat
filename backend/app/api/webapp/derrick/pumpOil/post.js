const { Router } = require("express");
const authMiddleware = require("../../../../middlewares/authMiddleware");
const ApiError = require("../../../../exceptions/api-error");

module.exports = Router({ mergeParams: true }).post("/derrick/pumpOil", authMiddleware, async (req, res, next) => {
	try {
		const { db } = req;
		const {} = req.body; // номер локації на якій юзер буде прокачувати вишку
		const tgId = req.user.id;
		let userLocationsModel = db.Locations;
		let userModel = db.User;

		let user = await userModel.findOne({ tgId });

		if (!user) {
			return next(new ApiError(404, "User not found"));
		}

		if (user.isOilPumping == true) {
			return next(new ApiError(404, "Oil pumping is already started"));
		}

		if (user.isOilClaimed == false) {
			return next(new ApiError(404, "First make the storage empty"));
		}

		if (user.notClaimedOil >= user.maxOilAmount) {
			return next(new ApiError(404, "Cannot start oil pumping, first make the storage empty"));
		}

		let userLocations = await userLocationsModel.find({
			ownerTgId: tgId,
			isDerrickBought: true,
			isDerrickRepairing: false,
			derrickDurability: { $ne: 0 },
			isDerrickAvailable: true,
		});

		if (userLocations.length == 0) {
			return next(ApiError.BadRequest("You have no derricks to pump oil"));
		}

		let hourlyDerricksRate = userLocations.map((derrick) => derrick.derrickMiningRate).reduce((sum, rate) => sum + rate, 0);

		user.isOilPumping = true;
		user.isOilClaimed = false;

		await user.save();

		res.json({ user, isOilPumping: user.isOilPumping, isOilClaimed: user.isOilClaimed, hourlyDerricksRate: hourlyDerricksRate });
	} catch (error) {
		console.error("Error upgrading burger level:", error.message);
		next(error);
	}
});
