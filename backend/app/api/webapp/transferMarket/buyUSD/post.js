const { Router } = require("express");
const ApiError = require("../../../../exceptions/api-error");
const authMiddleware = require("../../../../middlewares/authMiddleware");

// get current derrick level
module.exports = Router({ mergeParams: true }).post("/transferMarket/buyUSD", authMiddleware, async (req, res, next) => {
	try {
		const { db } = req;
		const { USDAmount } = req.body; // кількість доларів дял обміну
		const tgId = req.user.id;
		let userModel = db.User;

		let user = await userModel.findOne({ tgId });

		if (!user) {
			throw res.status(404).json("User not found");
		}

		user.balance += USDAmount;

		await user.save();

		res.json({ user });
	} catch (error) {
		console.error("Error while buying a derrick:", error);
		next(error);
	}
});
