const fs = require("fs");
const path = require("path");
const CommunityPhotoPath = path.join(__dirname, "..", "media", "community.jpg");
const { joinCommunityMessage } = require("../messages/messages");

async function joinCommunity(msg, bot) {
	try {
		const chatId = msg.message.chat.id;

		const options = {
			parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: "🐚 Crabs | Channel",
							url: `https://t.me/crabssol`,
						},
					],
					[
						{
							text: "⚓️ Crabs | Chat",
							url: `https://t.me/crabseng`,
						},
					],
					[
						{
							text: "🦀 Crabs | X (Twitter)",
							url: `https://x.com/Crabs_Solana`,
						},
					],
					[
						{
							text: "👋 PLAY NOW",
							web_app: {
								url: `${process.env.WEBSITE_URL}?telegramUserId=${msg.from.id}`,
							},
						},
					],
				],
			},
		};

		await bot.sendPhoto(chatId, fs.createReadStream(CommunityPhotoPath), {
			caption: joinCommunityMessage,
			parse_mode: options.parse_mode,
			reply_markup: options.reply_markup,
		});
	} catch (error) {
		bot.sendMessage("Ошибка how_to_play");
	}
}

module.exports = joinCommunity;
