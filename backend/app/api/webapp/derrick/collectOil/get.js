const { Router } = require("express");
const authMiddleware = require("../../../../middlewares/authMiddleware");
const ApiError = require("../../../../exceptions/api-error");

module.exports = Router({ mergeParams: true }).get("/derrick/collectOil", authMiddleware, async (req, res, next) => {
	try {
		const { db } = req;
		const tgId = req.user.id;
		let userModel = db.User;

		let user = await userModel.findOne({ tgId });

		if (!user) {
			return next(new ApiError(404, "User not found"));
		}

		if (user.isOilClaimed == true) {
			return next(new ApiError(404, "You have alredy claimed oil"));
		}

		let notClaimedOil = user.notClaimedOil;
		user.oilAmount += notClaimedOil;
		user.isOilPumping = false;
		user.isOilClaimed = true;
		user.notClaimedOil = 0;

		await user.save();

		res.json({
			user,
			isOilPumping: user.isOilPumping,
			isOilClaimed: user.isOilClaimed,
			oilAmount: user.oilAmount,
			gotOilAmount: notClaimedOil,
		});
	} catch (error) {
		console.error("Error upgrading burger level:", error.message);
		next(error);
	}
});
