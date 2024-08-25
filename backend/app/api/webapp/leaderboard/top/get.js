const { Router } = require("express");
const { Types } = require("mongoose");

module.exports = Router({ mergeParams: true }).get("/users/leaderboard", async (req, res, next) => {
	try {
		const { db } = req;

		const topUsers = await db.User.find().sort({ balance: -1 }).limit(100);

		const totalUsers = await db.User.countDocuments();
		const totalBalanceData = await db.User.aggregate([{ $group: { _id: null, totalBalance: { $sum: "$balance" } } }]);
		const totalBalance = totalBalanceData[0] ? totalBalanceData[0].totalBalance : 0;

		const topUsersInfo = topUsers.map((user, index) => ({
			position: index + 1,
			tgId: user.tgId,
			nickName: user.nickName,
			balance: user.balance,
			avatarUrl: user.avatarUrl,
		}));

		const currentDate = new Date();
		const twentyFourHoursAgo = new Date(currentDate);
		twentyFourHoursAgo.setHours(currentDate.getHours() - 24);

		const registeredUsersCount24h = await db.User.countDocuments({
			createdAt: {
				$gte: twentyFourHoursAgo,
				$lt: currentDate,
			},
		});

		const todayMidnight = new Date(new Date().setUTCHours(0, 0, 0, 0));

		const registeredUsersCount = await db.User.countDocuments({
			createdAt: {
				$gte: todayMidnight,
				$lt: currentDate,
			},
		});

		res.json({
			topUsers: topUsersInfo,
			totalUsers,
			totalBalance,
			registeredUsersCount24h,
			registeredUsersCount,
		});
	} catch (error) {
		console.error("Ошибка при получении топ-50 пользователей:", error);
		next(error);
	}
});
