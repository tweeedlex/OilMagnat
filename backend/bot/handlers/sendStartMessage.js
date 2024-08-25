const path = require("path");
const WelcomePhotoPath = path.join(__dirname, "..", "media", "logo.jpg");
const websiteUrl = process.env.WEBSITE_URL;
const fs = require("fs");
const { subscribeMessage, loginedMessage } = require("../messages/messages");

async function sendStartMessage(tgBot, userId) {
	const options = {
		parse_mode: "HTML",
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: "🤚🏻Let’s Tap",
						web_app: {
							url: `${websiteUrl}?telegramUserId=${userId}`,
						},
					},
				],
				[
					{
						text: "🧐 How to play",
						callback_data: "how_to_play",
					},
				],
				[
					{
						text: "🦀 Community",
						callback_data: "join_community",
					},
				],
				[
					{
						text: "💳 Wallet",
						callback_data: "add_wallet",
					},
				],
			],
		},
	};

	await tgBot.sendPhoto(userId, fs.createReadStream(WelcomePhotoPath), {
		caption: loginedMessage,
		parse_mode: options.parse_mode,
		reply_markup: options.reply_markup,
	});
}

module.exports = {
	sendStartMessage,
};
