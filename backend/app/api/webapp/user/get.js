const { Router } = require("express");
const authMiddleware = require("../../../middlewares/authMiddleware");

module.exports = Router({ mergeParams: true }).get("/user", authMiddleware, async (req, res, next) => {
	try {
		const tgId = req.user.id;
		const { db } = req;

		const user = await db.User.findOne({ tgId });

		if (!user) {
			return res.status(404).json("User not found");
		}

		let boughtLocations = await db.Locations.countDocuments({ ownerTgId: tgId });
		let refferalsCount = await db.User.countDocuments({ EnterReferralCode: user.referralCode });
		let workersCount = user.repairWorkerLevel + user.traderWorkerLevel + user.consultantWorkerLevel;
		let generalWorkerCount = 15;
		let totalResouces = user.totalOilEarned;
		let tasksCompleted = 0;
		let totalOilProduction = user.totalBalanceEarned;

		let referrals = await db.User.find(
			{ EnterReferralCode: user.referralCode },
			{ nickName: 1, tgUsername: 1, avatarUrl: 1, balance: 1 }
		);

		res.json({
			user,
			company: "",
			boughtLocations,
			refferalsCount,
			workers: { workersCount, generalWorkerCount },
			totalResouces,
			tasksCompleted,
			totalOilProduction,
			refferalCode: `https://t.me/${process.env.TG_BOT_USERNAME}/start?startapp=${user.referralCode}`,
			referrals,
		});
	} catch (error) {
		console.error("Error:", error.message);
		next(error);
	}
});
