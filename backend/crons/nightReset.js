const cron = require("node-cron");
const moment = require("moment-timezone");

function timeUntilMidnightUTC() {
	const now = moment().utc();
	const midnight = moment().utc().endOf("day");
	const duration = moment.duration(midnight.diff(now));

	const hours = Math.floor(duration.asHours());
	const minutes = Math.floor(duration.asMinutes() % 60);
	const seconds = Math.floor(duration.asSeconds() % 60);

	console.log(`Time until 00:00 UTC: ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`);
}

const updateSettingsValues = async (db) => {
	await db.Settings.findOneAndUpdate(
		{},
		{
			oilToUSDCurrency: Math.floor(Math.random() * (90 - 50 + 1)) + 50,
		}
	);
};

const startNightResetSchedule = (db) => {
	updateSettingsValues(db);
	cron.schedule(
		"0 0 * * *",
		() => {
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
