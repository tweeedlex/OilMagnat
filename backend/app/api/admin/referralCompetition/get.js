const { Router } = require("express");
const authMiddleware = require("../../../middlewares/authMiddleware");

module.exports = Router({ mergeParams: true }).get("/admin/referralCompetition", async (req, res, next) => {
	try {
		const { db } = req;

		// Fetch all users and their referral codes in a single query
		const allUsers = await db.User.find({});

		// Fetch all users who have entered referral codes in another single query
		const usersWithReferralCodes = await db.User.find({ EnterReferralCode: { $exists: true, $ne: "" } });

		// Create a map of referral codes to users
		const referralCodeMap = new Map();
		allUsers.forEach((user) => {
			referralCodeMap.set(user.referralCode, user);
		});

		// Initialize referrals info for each user
		allUsers.forEach((user) => {
			user._doc.referrals = [];
		});

		// Process the users who have entered referral codes
		usersWithReferralCodes.forEach((referral) => {
			const refCodes = referral.EnterReferralCode.split(".");
			refCodes.forEach((code, index) => {
				const referrer = referralCodeMap.get(code);
				if (referrer) {
					const level = refCodes.length - index;
					if (level > 0) {
						const existingLevel = referrer._doc.referrals.find((r) => r.level === level);
						if (existingLevel) {
							existingLevel.amount++;
						} else {
							referrer._doc.referrals.push({ level, amount: 1 });
						}
					}
				}
			});
		});

		// Create the users array for the response
		let users = allUsers.map((user) => ({
			tgUsername: user.tgUsername,
			nickName: user.nickName,
			tgId: user.tgId,
			referrals: user._doc.referrals,
			allReferralsAmount: user._doc.referrals.reduce((acc, curr) => acc + curr.amount, 0),
		}));

		// Sort and return top 100 users by referral amount
		users = users
			.sort((a, b) => {
				const aAmount = a.referrals.reduce((acc, curr) => acc + curr.amount, 0);
				const bAmount = b.referrals.reduce((acc, curr) => acc + curr.amount, 0);
				return bAmount - aAmount;
			})
			.slice(0, 100);

		res.json(users);
	} catch (error) {
		console.error("Error:", error.message);
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
		return -1;
	}
}
