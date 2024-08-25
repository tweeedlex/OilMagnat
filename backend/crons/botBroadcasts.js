const cron = require("node-cron");
const { broadcastMessage } = require("../app/helpers/broadcasts");

const broadcastInactive = async (db, bot) => {
	const sendMessageObject = await db.SendMessage.findOne({ type: "24hours" });
	const randomMessage = sendMessageObject.messages[Math.floor(Math.random() * sendMessageObject.messages.length)];

	// more than 24 hours
	const cutoffDate = new Date(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
	const users = await db.User.find({
		isBotBlocked: false,
		lastLoginDate: { $lt: cutoffDate },
		isGotInactiveMessage: false,
	});
	broadcastMessage(db, bot, users, randomMessage);

	await db.User.updateMany(
		{
			isBotBlocked: false,
			lastLoginDate: { $lt: cutoffDate },
		},
		{
			$set: { isGotInactiveMessage: true },
		}
	);
};

const broadcastClaw = async (db, bot) => {
	const sendMessageObject = await db.SendMessage.findOne({ type: "claw" });
	const settings = await db.Settings.findOne();
	const randomMessage = sendMessageObject.messages[Math.floor(Math.random() * sendMessageObject.messages.length)];
	const users = await db.User.find({
		isBotBlocked: false,
		notClaimedBalance: { $gte: settings.MinClawAlert },
	});

	broadcastMessage(db, bot, users, randomMessage, null, ["reward"], ["notClaimedBalance"], { reward: Math.floor });
};

const broadcastDaily = async (db, bot) => {
	const sendMessageObject = await db.SendMessage.findOne({ type: "daily" });
	const randomMessage = sendMessageObject.messages[Math.floor(Math.random() * sendMessageObject.messages.length)];
	const todayMidnight = new Date(new Date().setUTCHours(0, 0, 0, 0));
	const yesterdayMidnight = new Date(todayMidnight.getTime() - 24 * 60 * 60 * 1000);
	const settings = await db.Settings.findOne();

	const users = await db.User.find({
		isBotBlocked: false,
		dailyStreak: {
			$not: {
				$elemMatch: { date: todayMidnight },
			},
		},
	});

	const dayName = (date, locale) => date.toLocaleDateString(locale, { weekday: "long" });

	broadcastMessage(db, bot, users, randomMessage, null, ["reward", "next_day"], ["dailyStreak", ""], {
		reward: (dailyStreak) => {
			const dayObj = dailyStreak.find((obj) => obj.date.getTime() === yesterdayMidnight.getTime());
			if (!dayObj) {
				return settings.StartReward;
			}
			const reward =
				dayObj.reward + dayObj.reward * ((settings.BreakLevel <= dayObj.day ? settings.StepAfterBreak : settings.Step) / 100);
			return Math.floor(reward);
		},
		next_day: () => dayName(new Date(todayMidnight.getTime() + 24 * 60 * 60 * 1000), "en-US"),
	});
};

const startBroadcastSchedule = (db, bot) => {
	cron.schedule(
		// every 2 hours
		"0 */2 * * *",
		() => {
			broadcastInactive(db, bot);
		},
		{
			scheduled: true,
			timezone: "UTC",
		}
	);

	cron.schedule(
		"0 12 * * *",
		() => {
			broadcastClaw(db, bot);
		},
		{
			scheduled: true,
			timezone: "UTC",
		}
	);

	cron.schedule(
		"0 2 * * *",
		() => {
			broadcastDaily(db, bot);
		},
		{
			scheduled: true,
			timezone: "UTC",
		}
	);

	console.log("Scheduled broadcasts job.");
};

module.exports = startBroadcastSchedule;
