require("dotenv").config();
const port = process.env.PORT || 8080;
const setupDatabase = require("./database/setupDatabase.js");
const setupCrons = require("./crons/setupCrons.js");
const logger = require("./createLogger.js")();
const database = require("./database/createDatabase.js")({
	logger,
	mongoose: require("mongoose"),
});
const createTelegramBot = require("./bot/createTelegramBot");
const bot = createTelegramBot(database);
const app = require("./app/createExpressApp.js")({ logger, database, bot });
const server = require("http").createServer();

setupDatabase(database);
// setupCrons(database, bot);

server
	.on("request", app)
	.on("listening", function () {
		const addr = this.address();
		const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
		logger.info(`Listening on ${bind}`);
	})
	.on("error", function (error) {
		if (error.syscall !== "listen") throw error;
		const addr = this.address() || { port };
		const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
		switch (error.code) {
			case "EACCES":
				logger.error(`${bind} requires elevated privileges`);
				return process.exit(1);
			case "EADDRINUSE":
				logger.error(`${bind} is already in use`);
				return process.exit(1);
			default:
				throw error;
		}
	})
	.listen(port);

module.exports = server;
