const cron = require("node-cron");
const moment = require("moment-timezone");
const { getConsultantWorkerBonus } = require("../app/helpers/traders");

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

async function takeWeeklyTax(db) {
	try {
		const { Settings, User } = db;
		const settings = await Settings.findOne({});
		const defaultWeeklyOilTax = settings.defaultWeeklyTax;

		// Получаем всех пользователей с необходимыми полями
		const users = await User.find();

		// Создаем массив обновлений
		const bulkOps = users.map((user) => {
			const consultantWorkerBonus = getConsultantWorkerBonus(user.consultantWorkerLevel, settings);
			const tradeOilTaxPercent = (defaultWeeklyOilTax - consultantWorkerBonus) / 100;
			const deductionAmount = user.weekBalanceEarned * tradeOilTaxPercent;

			return {
				updateOne: {
					filter: { _id: user._id },
					update: { $set: { balance: user.balance - deductionAmount } },
				},
			};
		});

		// Выполняем все обновления за один запрос
		await User.bulkWrite(bulkOps);
		return bulkOps;
	} catch (e) {
		console.log(e);
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

const startWeekResetSchedule = (db) => {
	cron.schedule(
		"0 0 * * 0", // Запускаем каждое воскресенье в 00:00
		async () => {
			await takeWeeklyTax(db);
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

module.exports = startWeekResetSchedule;
