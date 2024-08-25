const { Router } = require("express");
const { generateToken, verifyInitData, urlSearchParamsToObject, register } = require("../../../../helpers/auth");
const Bottleneck = require("bottleneck");

const limiter = new Bottleneck({
	minTime: 1000 / 25, // 25 запитів на секунду
	maxConcurrent: 1,
});

module.exports = Router({ mergeParams: true }).post("/user/create", async (req, res, next) => {
	try {
		const { db, tgBot, ApiError } = req;
		let { EnterReferralCode, initData } = req.body;

		const isDataValid = verifyInitData(initData);

		if (!isDataValid) {
			return next(ApiError.BadRequest("Invalid auth data"));
		}

		initData = urlSearchParamsToObject(initData);
		const tgUser = JSON.parse(initData.user);
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
