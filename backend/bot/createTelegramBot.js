const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const handleStartCommand = require("./handlers/start");
const BOT_TOKEN = process.env.BOT_TOKEN;

const createTelegramBot = (db) => {
	const WEBHOOK_URL = `${process.env.SERVER_URL}/api/bot${BOT_TOKEN}`;
	const bot = new TelegramBot(BOT_TOKEN, {
		webHook: {
			port: process.env.PORT,
		},
	});
	axios
		.post(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
			url: WEBHOOK_URL,
			allowed_updates: ["message", "chat_member", "callback_query", "chat_join_request", "my_chat_member"],
		})
		.then((response) => {
			console.log("Webhook set successfully");
		})
		.catch((error) => {
			if (error.response) {
				console.log("Error response status:", error.response.status);
				console.log("Error response data:", error.response.data);
				// console.log("Error response headers:", error.response.headers);
			} else if (error.request) {
				console.log("Error request data:", error.request);
			}
			console.log("Error config:", error.config);
		});

	console.log("Telegram bot started");

	bot.onText(/^\/start$/, async (msg) => {
		await handleStartCommand(msg, db, bot);
	});

	bot.onText(/^\/start (.+)$/, async (msg, match) => {
		const refCode = match[1];
		await handleStartCommand(msg, db, bot, refCode);
	});

	bot.on("callback_query", async (query) => {
		if (query.data === "how_to_play") {
			await howToPlay(query, db, bot);
		} else if (query.data === "join_community") {
			await joinCommunity(query, bot);
		} else if (query.data === "add_wallet") {
			await addWallet(query, db, bot);
		}
	});

	return bot;
};

module.exports = createTelegramBot;
