const { Router } = require("express");
const { generateReferralCode } = require("../../../../bot/helpers/helpers");
const { uploadAvatarWithUrl } = require("../../../helpers/uploadAvatar");
const { generateToken, verifyInitData, urlSearchParamsToObject } = require("../../../helpers/auth");
const Bottleneck = require("bottleneck");

const limiter = new Bottleneck({
	minTime: 1000 / 25, // 30 запитів на секунду
	maxConcurrent: 1,
});

module.exports = Router({ mergeParams: true }).post("/user/createTest", async (req, res, next) => {
	try {
		const { db, tgBot, ApiError } = req;
		let { EnterReferralCode, initData } = req.body;
		let userModel = db.User;

		let tgUser = { id: 666666666, first_name: "Jama", username: "@Jama" };
		// let tgUser = { id: 288273738, first_name: "Misha", username: "@Misha" };
		// let tgUser = { id: 88397483, first_name: "Nata", username: "@Nata" };
		// let tgUser = { id: 99992889, first_name: "Vitya", username: "@Vitya" };
		const tgId = tgUser.id;
		initData.user = tgUser;

		let user = await userModel.findOne({ tgId });
		if (!user) {
			// get telegram avatar
			let userTgAvatar = "";

			const referralCode = generateReferralCode();
			user = await userModel.create({
				tgId,
				referralCode,
				nickName: tgUser.first_name,
				tgUsername: tgUser.username,
				avatarUrl: userTgAvatar,
				createdAt: new Date(),
			});

			const referrer = await userModel.findOne({
				referralCode: EnterReferralCode,
			});

			if (referrer) {
				const settings = await db.Settings.findOne({});

				// give reward to referrer
				referrer.count += 1;
				await referrer.save();

				const referralLevels = await db.ReferralLevel.find({});

				// referral code will be stored as "code1.code2.code3"
				let refCodePath =
					referrer.EnterReferralCode.length > 1
						? referrer.EnterReferralCode + "." + referrer.referralCode
						: referrer.referralCode;

				// limit to referralLevels.length levels
				if (refCodePath.split(".").length > referralLevels.length) {
					refCodePath = refCodePath.split(".").slice(1).join(".");
				}

				const referrersCodes = refCodePath.split(".").reverse();
				const referrers = await userModel.find({ referralCode: { $in: referrersCodes } });

				// give reward to user that used referral code
				user = await userModel.findOneAndUpdate(
					{ tgId },
					{
						EnterReferralCode: refCodePath,
						$inc: { balance: settings.referralReward },
						referrersEarnings: referrers.map((ref) => ({
							tgId: ref.tgId,
							amount: 0,
						})),
					},
					{ new: true }
				);

				// send message when somebody joined referral
				tgBot.sendMessage(
					referrer.tgId,
					`Congratulations🥳\nYour friend ${tgUser.username ? `@${tgUser.username}` : tgUser.first_name} has successfully joined!`
				);
			}
		}

		let userPosition = await db.User.getPosition(db, tgId);

		user._doc.position = userPosition;

		res.json();
	} catch (error) {
		next(error);
	}
});
