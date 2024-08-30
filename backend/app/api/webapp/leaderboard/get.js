const { Router } = require("express");
const { Types } = require("mongoose");

module.exports = Router({ mergeParams: true }).get("/leaderboard", async (req, res, next) => {
	try {
		const { db } = req;

		// get to 100 users for all time
		const topUsersAllTime = await db.User.find().sort({ balance: -1 }).limit(100);
		const topUsersInfoAllTime = topUsersAllTime.map((user, index) => ({
			position: index + 1,
			tgId: user.tgId,
			nickName: user.nickName,
			username: user.tgUsername,
			balance: user.balance,
			avatarUrl: user.avatarUrl,
		}));

		// get to 100 users for week
		const topUsersWeek = await db.User.find().sort({ weekBalanceEarned: -1 }).limit(100);
		const topUsersInfoWeek = topUsersWeek.map((user, index) => ({
			position: index + 1,
			tgId: user.tgId,
			nickName: user.nickName,
			username: user.tgUsername,
			balance: user.weekBalanceEarned,
			avatarUrl: user.avatarUrl,
		}));

		const currentDate = new Date();
		const twentyFourHoursAgo = new Date(currentDate);
		twentyFourHoursAgo.setHours(currentDate.getHours() - 24);

		res.json({
			topUsersAllTime: topUsersInfoAllTime,
			topUsersWeek: topUsersInfoWeek,
		});
	} catch (error) {
		console.error("Ошибка при получении топ-50 пользователей:", error);
		next(error);
	}
});
