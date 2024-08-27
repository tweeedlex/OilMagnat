const cron = require("node-cron");
const moment = require("moment-timezone");

async function resetWeakEarning(db) {
	const { User } = db;
	try {
		await User.updateMany(
			{},
			{
				$set: { weekBalanceEarned: 0 },
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

const startNightResetSchedule = (db) => {
	cron.schedule(
		"0 0 * * 0", // Запускаем каждое воскресенье в 00:00
		() => {
			resetWeakEarning(db);
		},
		{
			scheduled: true,
			timezone: "UTC",
		}
	);

	console.log("Scheduled job set to run at 00:00 every Sunday in UTC timezone.");
	timeUntilMidnightUTC();
};

module.exports = startNightResetSchedule;
