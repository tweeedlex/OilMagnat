const path = require("path");
const WelcomePhotoPath = path.join(__dirname, "..", "media", "logo.jpg");
const fs = require("fs");
const { loginedMessage } = require("../messages/messages");

async function sendStartMessage(tgBot, userId) {
	const options = {
		parse_mode: "HTML",
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: "🤚🏻Let’s Tap",
						web_app: {
							url: `${process.env.WEBSITE_URL}?telegramUserId=${userId}`,
						},
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
