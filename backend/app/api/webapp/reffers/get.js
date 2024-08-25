const { Router } = require("express");
const authMiddleware = require("../../../middlewares/authMiddleware");
const ApiError = require("../../../exceptions/api-error");

module.exports = Router({ mergeParams: true }).get("/reffers", authMiddleware, async (req, res, next) => {
	try {
		const { db } = req;
		const tgId = req.user.id;

		const user = await db.User.findOne({ tgId });
		const settings = await db.Settings.findOne({});
		if (!settings) {
			return next(ApiError.BadRequest("Cannot find settings object"));
		}

		// получаем проценты по рефералке и сортируем их
		let referralLevels = await db.ReferralLevel.find();

		referralLevels = referralLevels
			.map((item) => ({ level: item.level, rewardPercent: item.rewardPercent }))
			.sort((a, b) => a.level - b.level);

		if (user.customReferralPercents.length > 0) {
			user.customReferralPercents.forEach((percent, i) => {
				if (percent !== undefined && percent !== -1) {
					const levelIndex = referralLevels.findIndex((item) => item.level === i + 1);
					if (levelIndex !== -1) {
						referralLevels[levelIndex].rewardPercent = +percent;
					}
				}
			});
		}

		// получаем рефералов
		const myReferrals = await db.User.find({
			EnterReferralCode: new RegExp(user.referralCode),
		});

		let referralsInfo = myReferrals.map((referral) => ({
			nickName: referral.nickName,
			bonus: referral.referrersEarnings.find((r) => r.tgId === tgId)?.amount ?? 0,
			avatarUrl: referral.avatarUrl,
			level: getReffererLevel(referral, user.referralCode),
		}));

		const referralEarnings = referralsInfo
			.filter((referral) => {
				return (
					referral.level === 1 || referral.level === 2 || referral.level === 3 || referral.level === 4 || referral.level === 5
				);
			})
			.reduce((acc, referral) => {
				if (referral.level == 1) {
					return acc + referral.bonus;
				} else {
					if (referral.bonus >= settings.referralReward) {
						return acc + referral.bonus - settings.referralReward;
					} else {
						return acc + referral.bonus;
					}
				}
			}, 0);

		const myBalance = user.balance;
		const link = `https://t.me/${process.env.TG_BOT_USERNAME}/start?startapp=${user.referralCode}`;
		const botStartLink = `https://t.me/${process.env.TG_BOT_USERNAME}?start=${user.referralCode}`;
		res.json({
			numberOfReferralsOtherLevels: referralsInfo.filter((referral) => referral.level != 1)?.length,
			numberOfReferrals: referralsInfo.filter((referral) => referral.level == 1)?.length,
			referralsInfo: (referralsInfo = referralsInfo
				.filter((referral) => referral.level == 1)
				.sort((a, b) => b.bonus - a.bonus)
				.slice(0, 100)),
			myBalance,
			link,
			botStartLink,
			refferalEarnings: referralEarnings,
			referralLevels: referralLevels,
		});
	} catch (error) {
		console.error("Ошибка при получении рефералов:", error.message);
		next(error);
	}
});

function getReffererLevel(refferal, referralCode) {
	let refCodes = refferal.EnterReferralCode.split(".");
	let codeIndex = refCodes.indexOf(referralCode);
	if (codeIndex !== -1) {
		const elementsAfter = refCodes.length - codeIndex - 1;
		if (elementsAfter === 0) {
			return 1;
		} else {
			return elementsAfter + 1;
		}
	} else {
		//error level code if user not refferal not found
		return -1;
	}
}
