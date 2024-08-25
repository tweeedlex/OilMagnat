const { idToString, generateReferralCode } = require("../helpers/helpers");
const { uploadAvatarWithUrl } = require("../../app/helpers/uploadAvatar");
const { sendStartMessage } = require("./sendStartMessage");
const { register } = require("../../app/helpers/auth");

async function handleStartCommand(msg, db, bot, refCode) {
	try {
		const user = await register(db, bot, refCode, msg.from);
		await sendStartMessage(bot, user.tgId);
	} catch (error) {
		console.error("Error in transfer function:", error);
	}
}

module.exports = handleStartCommand;
