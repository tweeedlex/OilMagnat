const { Router } = require("express");
const authMiddleware = require("../../../middlewares/authMiddleware");
const { getUserTasksInfo } = require("../../../helpers/tasks");

module.exports = Router({ mergeParams: true }).post("/user/task", authMiddleware, async (req, res, next) => {
	try {
		const tgId = req.user.id;
		const { db, ApiError, tgBot } = req;
		const { taskId } = req.body;

		const user = await db.User.findOne({ tgId });
		const task = await db.Task.findOne({ _id: taskId });

		if (!task || task.hidden) {
			return next(ApiError.BadRequest("Task not found"));
		}

		if (user.completedTasks.includes(task._id)) {
			return next(ApiError.BadRequest("Task already completed"));
		}

		if (task.maxClaimsLimit && task.timesClaimed >= task.maxClaimsLimit) {
			return next(ApiError.BadRequest("Task limit reached"));
		}

		const allReferrals = await db.User.find({ EnterReferralCode: new RegExp(user.referralCode) });
		const firstLineReferrals = allReferrals.filter((referral) => {
			const codesPath = referral.EnterReferralCode.split(".").reverse();
			return codesPath[0] === user.referralCode;
		});

		if (task.referralsNeeded && task.referralsNeeded > firstLineReferrals.length) {
			return next(
				ApiError.BadRequest(`Not enough referrals`, {
					referralsNeeded: task.referralsNeeded,
					referrals: firstLineReferrals.length,
				})
			);
		}

		if (task.link.startsWith("https://t.me") && task?.chatId && !user.chatIds.includes(task?.chatId)) {
			try {
				const chatMember = await tgBot.getChatMember(task.chatId, user.tgId);

				const userStatus = chatMember.status;

				if (userStatus !== "member" && userStatus !== "administrator" && userStatus !== "creator") {
					return next(ApiError.BadRequest("Join the chat / channel first"));
				} else {
					user.chatIds.push(task.chatId);
				}
			} catch (e) {
				console.error("\nError:", e.message, "\nChat id:", task?.chatId, "\nTask name:", task.name);
				return next(ApiError.BadRequest(`Chat does not exist: ${task?.chatId}`));
			}
		}

		let userPosition = await db.User.getPosition(db, tgId);

		task.timesClaimed += 1;
		await task.save();

		user.completedTasks.push(task._id);
		user.balance += task.reward;
		await user.save();

		const tasksInfo = await getUserTasksInfo(db, tgId);

		user._doc.position = userPosition;
		res.json({ user, tasksInfo, referrals: firstLineReferrals.length });
	} catch (error) {
		console.error("Error:", error.message);
		next(error);
	}
});
