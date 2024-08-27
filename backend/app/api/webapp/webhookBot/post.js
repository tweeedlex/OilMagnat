const { Router } = require("express");
const { sendStartMessage } = require("../../../../bot/handlers/sendStartMessage");

module.exports = Router({ mergeParams: true }).post(`/bot${process.env.BOT_TOKEN}`, async (req, res, next) => {
	try {
		const { tgBot, body, db } = req;
		await tgBot.processUpdate(body);

		// check if user blocked / unblocked bot
		if (body.hasOwnProperty("my_chat_member")) {
			const msg = body.my_chat_member;
			const userId = msg.from.id;
			if (msg && msg.new_chat_member.status == "member") {
				await db.User.findOneAndUpdate({ tgId: userId }, { isBotBlocked: false });
			} else if (msg && msg.new_chat_member.status == "kicked") {
				await db.User.findOneAndUpdate({ tgId: userId }, { isBotBlocked: true });
			}
		}

		// проверка на первый меседж при переходе по сылке
		if (body.message) {
			const msg = body.message;
			const userId = msg.from.id;

			if (msg.write_access_allowed) {
				await sendStartMessage(tgBot, userId);
			}
		}

		// проверка на вход в группу
		const { error, userId, chatId, action } = extractIdsAndActionFromUpdate(body);

		if (!error) {
			const user = await db.User.findOne({ tgId: userId });
			if (user) {
				if (action == "enter") {
					if (!user.chatIds.includes(chatId)) {
						user.chatIds.push(chatId);
					}
				} else if (action == "left") {
					user.chatIds = user.chatIds.filter((id) => id !== chatId);
				}
				await user.save();
			}
		}
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
	}
});

function extractIdsAndActionFromUpdate(update) {
	let userId, chatId, action;

	if (update.chat_member) {
		userId = update.chat_member.from.id;
		chatId = update.chat_member.chat.id;
		action =
			update.chat_member.new_chat_member.status === "member" || update.chat_member.new_chat_member.status === "creator"
				? "enter"
				: "left";
		return { error: false, userId, chatId, action };
	} else if (update.message && (update.message.new_chat_member || update.message.left_chat_member)) {
		userId = update.message.from.id;
		chatId = update.message.chat.id;
		action = update.message.new_chat_member ? "enter" : "left";
		return { error: false, userId, chatId, action };
	} else {
		console.log("Invalid update format");
		return { error: true, userId, chatId, action };
	}
}
