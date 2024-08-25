const cron = require("node-cron");
const moment = require("moment-timezone");

async function resetNotClaimedTokens(db) {
	const { User } = db;
	try {
		const settings = await db.Settings.findOne({});

		await User.updateMany(
			{},
			{
				$set: {},
			}
		);

		console.log(`Reset not claimed tokens for all users.`);
	} catch (error) {
		console.error("Error giving coins to automining users:", error);
	}
}

function timeUntilMidnightUTC() {
	const now = moment().utc();
	const midnight = moment().utc().endOf("day");
	const duration = moment.duration(midnight.diff(now));

	const hours = Math.floor(duration.asHours());
	const minutes = Math.floor(duration.asMinutes() % 60);
	const seconds = Math.floor(duration.asSeconds() % 60);

	console.log(`Time until 00:00 UTC: ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`);
}

const roundTo5K = (num) => {
	const rounded = Math.ceil(num / 5000) * 5000;
	return rounded % 10000 === 0 ? rounded + 5000 : rounded;
};

const updateSettingsValues = async (db) => {
	const stats = await db.Stats.findOne({});
	const settingsPercents = await db.SettingsPercents.findOne({});

	const avgBalanceAfterReferral = stats.avgBalanceAfterReferral;

	await db.Settings.findOneAndUpdate(
		{},
		{
			referralReward: roundTo5K(avgBalanceAfterReferral * settingsPercents.referralReward),
			referralRewardPremium: 2 * roundTo5K(avgBalanceAfterReferral * settingsPercents.referralReward),
			ComboReward: roundTo5K(avgBalanceAfterReferral * settingsPercents.ComboReward),
			SecretKeyReward: roundTo5K(avgBalanceAfterReferral * settingsPercents.SecretKeyReward),
			SecretKeyAddAttemptsCost: 0.5 * roundTo5K(avgBalanceAfterReferral * settingsPercents.SecretKeyReward),
		}
	);
};

const startNightResetSchedule = (db) => {
	updateSettingsValues(db);
	cron.schedule(
		"0 0 * * *",
		() => {
			resetNotClaimedTokens(db);
			updateSettingsValues(db);
		},
		{
			scheduled: true,
			timezone: "UTC",
		}
	);

	console.log("Scheduled job set to run at 00:00 every day in UTC timezone.");
	timeUntilMidnightUTC();
};

module.exports = startNightResetSchedule;
