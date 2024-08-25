const { Router } = require("express");
const ApiError = require("../../../exceptions/api-error");
const authMiddleware = require("../../../middlewares/authMiddleware");

module.exports = Router({ mergeParams: true }).post("/admin/dailyStreak", authMiddleware, async (req, res, next) => {
	try {
		const { db } = req;
		const { startReward, allDaysCount, step, breakLevel, stepAfterBreak, clawInfluence, customLevelReward } = req.body;

		let settingsModel = db.Settings;
		let settings = await settingsModel.findOne({});
		if (!settings) {
			return next(ApiError.BadRequest("Cannot find settings"));
		}

		if (!startReward || !allDaysCount || !step || !breakLevel || !stepAfterBreak || !clawInfluence || !customLevelReward) {
			return next(
				ApiError.BadRequest(
					"Fields: startReward, allDaysCount, step, breakLevel, stepAfterBreak, clawInfluence, customLevelReward - are required"
				)
			);
		}

		await settings.updateOne({
			StartReward: startReward,
			AllDaysCount: allDaysCount,
			Step: step,
			BreakLevel: breakLevel,
			StepAfterBreak: stepAfterBreak,
			ClawInfluence: clawInfluence,
			CustomLevelReward: customLevelReward,
		});

		res.json({
			StartReward: settings.StartReward,
			AllDaysCount: settings.AllDaysCount,
			Step: settings.Step,
			BreakLevel: settings.BreakLevel,
			StepAfterBreak: settings.StepAfterBreak,
			ClawInfluence: settings.clawInfluence,
			CustomLevelReward: settings.CustomLevelReward,
		});
	} catch (error) {
		console.error("Error:", error.message);
		next(error);
	}
});
