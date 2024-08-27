const { Router } = require("express");
const { generateToken, verifyInitData, urlSearchParamsToObject, register } = require("../../../../helpers/auth");

module.exports = Router({ mergeParams: true }).post("/user/create", async (req, res, next) => {
	try {
		const { db, tgBot, ApiError } = req;
		let { EnterReferralCode, initData = {}, tgUser } = req.body;

		// initData = urlSearchParamsToObject(initData);
		const tgId = tgUser.id;
		initData.user = tgUser;

		const user = await register(db, tgBot, EnterReferralCode, tgUser);

		let userPosition = await db.User.getPosition(db, tgId);
		user._doc.position = userPosition;

		const { token, expiresIn } = generateToken(initData);

		res.json({ user, token, expiresIn });
	} catch (error) {
		next(error);
	}
});
