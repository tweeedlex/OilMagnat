const startNightResetSchedule = require("./nightReset");
const startAutominingCoins = require("./autominingScript");
const startEnergyRestoration = require("./shovel");
const startMinigamesSchedule = require("./minigames");
const startBroadcastSchedule = require("./botBroadcasts");

module.exports = (db, bot) => {
  startNightResetSchedule(db);
  startAutominingCoins(db);
  startEnergyRestoration(db);
  startMinigamesSchedule(db, bot);
  startBroadcastSchedule(db, bot);
}