const { Router } = require("express");
const ApiError = require("../../../../exceptions/api-error");
const authMiddleware = require("../../../../middlewares/authMiddleware");
const { getTraderWorkerBonus } = require("../../../../helpers/traders");

// get current derrick level
module.exports = Router({ mergeParams: true }).post("/transferMarket/changeOil", authMiddleware, async (req, res, next) => {
	try {
		const { db } = req;
		const { oilAmount } = req.body; // кількість нафти дял обміну
		const tgId = req.user.id;
		let userModel = db.User;

		let user = await userModel.findOne({ tgId });

		if (!user) {
			throw res.status(404).json("User not found");
		}

		if (user.oilAmount < oilAmount) {
			return next(ApiError.BadRequest("Not enough oil balance"));
		}

		let settings = await db.Settings.findOne({});

		if (!settings) {
			return next(ApiError.BadRequest("Cannot find settings object"));
		}

		let defaultTradeOilTax = settings.defaultTradeOilTax;
		let tradeOilTaxPercent = (defaultTradeOilTax - getTraderWorkerBonus(user.traderWorkerLevel, settings)) / 100;

		let currency = settings.oilToUSDCurrency;

		let usdBalance = oilAmount / currency; // кількість доларів переведених по курсу
		usdBalance -= usdBalance * tradeOilTaxPercent; // віднімаємо % комісії

		user.balance += usdBalance;
		user.oilAmount -= oilAmount;

		await user.save();

		res.json({ user, usdBalance, oilAmount, tradeOilTaxPercent });
	} catch (error) {
		console.error("Error while buying a derrick:", error);
		next(error);
	}
});
