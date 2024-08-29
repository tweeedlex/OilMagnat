const startNightResetSchedule = require("./nightReset");
const startWeekResetSchedule = require("./weekReset");
const startOilPumpingSchedule = require("./oilPumping");

module.exports = (db, bot) => {
	startNightResetSchedule(db);
	startWeekResetSchedule(db);
	startOilPumpingSchedule(db);
};
