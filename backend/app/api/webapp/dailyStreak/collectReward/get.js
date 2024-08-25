const { Router } = require("express");
const ApiError = require("../../../exceptions/api-error");
const authMiddleware = require("../../../middlewares/authMiddleware");

module.exports = Router({ mergeParams: true }).get("/dailyStreak/collectReward", authMiddleware, async (req, res, next) => {
	try {
		const tgId = req.user.id;
		const { db } = req;
		let settingsModel = db.Settings;
		let user = await db.User.findOne({ tgId });
		if (!user) {
			return next(ApiError.BadRequest("Cannot find user"));
		}
		let settings = await settingsModel.findOne({});
		if (!settings) {
			return next(ApiError.BadRequest("Cannot find settings"));
		}
		let startReward = settings.StartReward;
		let daysCount = settings.AllDaysCount;
		let step = settings.Step;
		let breakLevel = settings.BreakLevel;
		let stepAfterBreak = settings.StepAfterBreak;
		let clawInfluence = settings.ClawInfluence;
		let CustomLevelReward = settings.CustomLevelReward;

		if (startReward == null || startReward == undefined) {
			return next(ApiError.BadRequest("Cannot find 'startReward' parameter for daily streak"));
		}
		if (daysCount == null || daysCount == undefined) {
			return next(ApiError.BadRequest("Cannot find 'daysCount' parameter for daily streak"));
		}
		if (step == null || step == undefined) {
			return next(ApiError.BadRequest("Cannot find 'step' parameter for daily streak"));
		}
		if (breakLevel == null || breakLevel == undefined) {
			return next(ApiError.BadRequest("Cannot find 'breakLevel' parameter for daily streak"));
		}
		if (stepAfterBreak == null || stepAfterBreak == undefined) {
			return next(ApiError.BadRequest("Cannot find 'stepAfterBreak' parameter for daily streak"));
		}
		if (clawInfluence == null || clawInfluence == undefined) {
			return next(ApiError.BadRequest("Cannot find 'clawInfluence' parameter for daily streak"));
		}
		if (CustomLevelReward == null || CustomLevelReward == undefined) {
			return next(ApiError.BadRequest("Cannot find 'CustomLevelReward' parameter for daily streak"));
		}

		let rewards = [
			{
				day: 1,
				reward: startReward + startReward * (user.clawLevel * clawInfluence),
			},
		];
		for (let i = 1; i < daysCount; i++) {
			let rewardBefore = rewards[i - 1]?.reward || 0;
			let day = {
				day: i + 1,
				reward: Math.floor(rewardBefore + rewardBefore * (step / 100)),
			};
			if (breakLevel && breakLevel <= i) {
				day.reward = Math.floor(rewardBefore + rewardBefore * (stepAfterBreak / 100));
			}
			rewards.push(day);
		}

		// добавляем к обычным наградам, награды SpecialRewards

		CustomLevelReward.forEach((special) => {
			const match = rewards.find((r) => r.day === special.day);
			if (match) {
				match.reward += special.reward;
			}
		});

		// проверяем какой сегодня день стрика

		const todayMidnight = new Date(new Date().setHours(0, 0, 0, 0));

		if (!user.lastRewardDate) {
			// Если это первый раз, когда пользователь получает награду
			user.dailyStreakDay = 1;
			let todayRewardElement = rewards.find((el) => {
				return el.day == user.dailyStreakDay;
			});
			if (!todayRewardElement) {
				return next(ApiError.BadRequest("Cannot find today's reward"));
			}
			let todayReward = todayRewardElement.reward;
			user.dailyStreak = [{ day: user.dailyStreakDay, reward: todayReward, date: todayMidnight }];
			user.balance += todayReward;
		} else {
			const lastRewardDateMidnight = new Date(user.lastRewardDate.setHours(0, 0, 0, 0));
			const timeDifference = todayMidnight.getTime() - lastRewardDateMidnight.getTime();
			const daysDifference = timeDifference / (1000 * 3600 * 24);

			if (daysDifference == 1 && user.dailyStreakDay <= settings.AllDaysCount) {
				// Если пользователь получил награду вчера, увеличиваем стрик
				let dailyStreakDay = user.dailyStreakDay;
				if (user.dailyStreakDay != settings.AllDaysCount) {
					dailyStreakDay += 1;
				}
				let todayRewardElement = rewards.find((el) => {
					return el.day == dailyStreakDay;
				});
				if (!todayRewardElement) {
					return next(ApiError.BadRequest("Cannot find today's reward"));
				}
				let todayReward = todayRewardElement.reward;

				user.dailyStreak = [...user.dailyStreak, { day: dailyStreakDay, reward: todayReward, date: todayMidnight }];
				user.balance += todayReward;
				user.dailyStreakDay += 1;
			} else if (daysDifference < 1) {
				return next(ApiError.BadRequest("You have already received the reward today"));
			} else if (daysDifference > 1 || user.dailyStreakDay > settings.AllDaysCount) {
				// Если пользователь пропустил день, сбрасываем стрик на первый день и даем награду
				user.dailyStreakDay = 1;
				let todayRewardElement = rewards.find((el) => {
					return el.day == user.dailyStreakDay;
				});
				if (!todayRewardElement) {
					return next(ApiError.BadRequest("Cannot find today's reward"));
				}
				let todayReward = todayRewardElement.reward;

				user.dailyStreak = [{ day: user.dailyStreakDay, reward: todayReward, date: todayMidnight }];
				user.balance += todayReward;
			}
		}

		// Обновляем дату последнего получения награды
		user.lastRewardDate = todayMidnight;
		user.isDailyClaimedToday = true;

		await user.save();

		let userPosition = await db.User.getPosition(db, tgId);

		res.json({ user, position: userPosition });
	} catch (error) {
		console.error("Error:", error.message);
		next(error);
	}
});
