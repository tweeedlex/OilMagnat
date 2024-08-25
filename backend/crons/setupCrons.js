const startNightResetSchedule = require("./nightReset");

module.exports = (db, bot) => {
	startNightResetSchedule(db);
};
