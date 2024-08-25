const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const handleStartCommand = require("./handlers/start");
const handleMinigamesCommand = require("./handlers/minigames");
const broadcastMessage = require("./handlers/broadcast");
const howToPlay = require("./handlers/howToPlay");
const joinCommunity = require("./handlers/joinCommunity");
const addWallet = require("./handlers/addWallet");
const { idToString } = require("./helpers/helpers");
const BOT_TOKEN = process.env.BOT_TOKEN;

let broadcastState = [];

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

	bot.onText(/^\/minigames$/, async (msg) => {
		await handleMinigamesCommand(msg, db, bot);
	});

	bot.on("message", async (msg) => {
		// exclude commands
		if (msg.text && msg.text.startsWith("/")) {
			return;
		}

		// broadcast
		if (broadcastState.includes(msg.from.id)) {
			if (msg.text || msg.photo) {
				broadcastState = broadcastState.filter((id) => id !== msg.from.id);

				await broadcastMessage(db, bot, msg);

				await bot.sendMessage(msg.from.id, "Message was broadcasted.");
			} else {
				await bot.sendMessage(msg.from.id, "Send a message to broadcast.");
			}
		}

		const settings = await db.Settings.findOne();
		if (settings.BonusAllowedChatIds.includes(msg.chat.id)) {
			const message = msg.text || msg.caption;
			const bonusAmount = settings.BonusAmount;
			if (message?.length >= settings.BonusMinLen) {
				await db.User.updateOne({ tgId: idToString(msg.from.id) }, { $inc: { notClaimedBalance: bonusAmount, ChatMessages: 1 } });
			}
		}
	});

	bot.onText(/\/broadcast/, async (msg) => {
		const user = await db.User.findOne({ tgId: idToString(msg.from.id) });

		if (user.roles.includes("ADMIN")) {
			broadcastState.push(user.tgId);
			bot.sendMessage(user.tgId, "Send a message or image to broadcast.");
		} else {
			bot.sendMessage(user.tgId, "You don't have access to use this command.");
		}
	});

	// bot.on("chat_member", async (msg) => {
	// 	const chatMember = msg.chat_member;
	// 	console.log(chatMember);
	// 	console.log(chatMember.new_chat_member);
	// 	const userId = chatMember.user.id;

	// 	if (chatMember.new_chat_member.status === "kicked") {
	// 		await db.User.updateOne({ tgId: userId }, { $set: { isBotBlocked: true } });
	// 	} else if (chatMember.new_chat_member.status === "member") {
	// 		await db.User.updateOne({ tgId: userId }, { $set: { isBotBlocked: false } });
	// 	}
	// });

	bot.on("callback_query", async (query) => {
		// const chatId = query.message.chat.id;
		// const userId = idToString(query.from.id);
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
