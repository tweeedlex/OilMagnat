const { Router } = require("express");
const ApiError = require("../../../exceptions/api-error");
const authMiddleware = require("../../../middlewares/authMiddleware");

// get current derrick level
module.exports = Router({ mergeParams: true }).get("/transferMarket", authMiddleware, async (req, res, next) => {
	try {
		const { db } = req;
		const tgId = req.user.id;
		let userModel = db.User;

		let user = await userModel.findOne({ tgId });

		if (!user) {
			throw res.status(404).json("User not found");
		}

		let settings = await db.Settings.findOne({});

		if (!settings) {
			return next(ApiError.BadRequest("Cannot find settings object"));
		}

		let tradeOilTax = settings.tradeOilTax;
		let currency = settings.oilToUSDCurrency;
		let availableOil = user.oilAmount;
		let availableUSD = user.balance;

		res.json({ currency, availableOil, availableUSD, tradeOilTax });
	} catch (error) {
		console.error("Error while buying a derrick:", error);
		next(error);
	}
});
