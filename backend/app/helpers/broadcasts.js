const Bottleneck = require("bottleneck");

const limiter = new Bottleneck({
	minTime: 1000 / 2, // 2 requests per second
	maxConcurrent: 1,
});

let websiteUrl = process.env.WEBSITE_URL;
if (websiteUrl.endsWith("/")) {
	websiteUrl = websiteUrl.slice(0, -1);
}
const TG_BOT_USERNAME = process.env.TG_BOT_USERNAME;

const broadcastMessage = async (db, bot, users, msg, markup_type = "default", variableNames, fields, variableHandlers) => {
	const blockedUsers = [];
	const settings = await db.Settings.findOne();

	const processUser = async (user) => {
		const reply_markup = {};
		if (markup_type == "friends") {
			reply_markup.inline_keyboard = [
				[
					{
						text: "👥 Invite friends",
						web_app: {
							url: `${websiteUrl}/friends?telegramUserId=${user.tgId}`,
						},
					},
					{
						text: "Share invite link",
						url: `https://t.me/share/url?url=https://t.me/${TG_BOT_USERNAME}/start?startapp=${user.referralCode}&text=${encodeURIComponent(
							`Come on and earn tokens with CrabsTap🦀\nTake first-time gift ${settings.referralReward} tokens if basic user💵\nTake first-time gift ${settings.referralRewardPremium} tokens if premium user💵`
						)}`
					}
				],
			];
		} else {
			reply_markup.inline_keyboard = [
				[
					{
						text: "🤚🏻 Let’s Tap",
						web_app: {
							url: `${websiteUrl}?telegramUserId=${user.tgId}`,
						},
					},
				],
			];
		}

		try {
			if (variableNames?.length && fields?.length) {
				// replace each placeholder in message with user field that is processed by variableHandlers
				msg = variableNames.reduce((acc, variableName, index) => {
					const field = fields[index];
					const value = variableHandlers[variableName] ? variableHandlers[variableName](user[field]) : user[field];
					return acc.replace(`{${variableName}}`, value);
				}, msg);
			}

			await bot.sendMessage(user.tgId, msg, {
				parse_mode: "HTML",
				reply_markup: JSON.stringify(reply_markup),
			});
		} catch (e) {
			switch (e.response?.body?.error_code) {
				case 403:
					console.log(`User ${user.tgId} blocked the bot, added to blocked users list`);
					blockedUsers.push(user.tgId);
					break;
				case 429:
					// rate limited, waiting 30 seconds
					await new Promise((resolve) => setTimeout(resolve, 30000));
					await processUser(user);
					break;
				default:
					console.error("Broadcast error:", e);
			}
		}
	};

	const promises = users.map((user) => limiter.schedule(() => processUser(user)));
	await Promise.all(promises);

	if (blockedUsers.length > 0) {
		await db.User.updateMany({ tgId: { $in: blockedUsers } }, { isBotBlocked: true });
		console.log(`Updated isBotBlocked to true for ${blockedUsers.length} users`);
	}
	console.log("Broadcast finished");
};

module.exports = { broadcastMessage };
