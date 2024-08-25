const Bottleneck = require("bottleneck");

const limiter = new Bottleneck({
	minTime: 1000 / 2, // 2 запити на секунду
	maxConcurrent: 1,
});

const websiteUrl = process.env.WEBSITE_URL;

const broadcastMessage = async (db, bot, msg) => {
	const users = await db.User.find({ isBotBlocked: false });

	users.forEach((user) => {
		const reply_markup = {
			inline_keyboard: [
				[
					{
						text: "🤚🏻 Let’s Tap",
						web_app: {
							url: `${websiteUrl}?telegramUserId=${user.tgId}`,
						},
					},
				],
			],
		};

		limiter.schedule(() => {
			try {
				bot.copyMessage(user.tgId, msg.chat.id, msg.message_id, {reply_markup});
			} catch (e) {
				console.log(e);
			}
		});
	});
};

module.exports = broadcastMessage;
