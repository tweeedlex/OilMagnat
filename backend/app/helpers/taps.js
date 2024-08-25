const { broadcastMessage } = require("./broadcasts");

const handleTaps = async (tapMultiplier, req, next) => {
	const { db, tgBot, ApiError } = req;
	const tgUser = req.user;
	const tgId = tgUser.id;
	let { tapsAmount, energy, tapStart } = req.body;
	if (!tapsAmount || (!energy && energy !== 0) || !tapStart) {
		throw next(ApiError.BadRequest("Missing tapsAmount, energy or tapStart"));
	}

	// if in ms, convert to seconds
	if (tapStart.toString().length > 10) {
		tapStart = tapStart / 1000;
	}

	let reports = 0;

	if (tapsAmount <= 0) {
		throw next(ApiError.BadRequest("tapsAmount has to be greater than 0"));
	}
	const settings = await db.Settings.findOne();

	let user = await db.User.findOne({ tgId });
	let userPosition = await db.User.getPosition(db, tgId);

	const now = Math.round(new Date().getTime() / 1000);
	if (tapStart <= user.tapStart - 2 || tapStart > now + 2) {
		throw next(ApiError.BadRequest("Invalid tapStart"));
	}

	// check if request is valid
	const maxUserEnergy = 500 + user.burgerLevel * 500;
	const usedEnergy = tapsAmount * user.spatulaLevel;
	const startTimeDifference = now - tapStart;
	const energyDifference = usedEnergy - user.burgerEnergy;
	let requestTimeDifference = now - user.lastTapTimestamp;
	if (requestTimeDifference > startTimeDifference) {
		requestTimeDifference = startTimeDifference;
	}
	const validRefilledEnergy = Math.ceil(startTimeDifference) * user.spatulaLevel;
	const CPS = Number((tapsAmount / requestTimeDifference).toFixed(2));
	console.log(`CPS: ${CPS} | tgId: ${tgId}`);
	const reportConditions = [
		energyDifference > validRefilledEnergy + validRefilledEnergy * 0.3,
		startTimeDifference > 300,
		tapMultiplier === 1 && tapsAmount > 500,
		tapMultiplier !== 1 && tapsAmount > 1500, // for boosts
	];

	if (energyDifference > validRefilledEnergy + validRefilledEnergy * 0.3) {
		console.log(`Added report for ${tgId}: Used for taps energy is more than refilled energy + user.burgerEnergy`);
	}
	if (startTimeDifference > 300) {
		console.log(`Added report for ${tgId}: Start time and now difference is more than 300 seconds`);
	}
	if (tapMultiplier === 1 && tapsAmount > 500) {
		console.log(`Added report for ${tgId}: Taps amount is more than 500 (without boost)`);
	}
	if (tapMultiplier !== 1 && tapsAmount > 1500) {
		console.log(`Added report for ${tgId}: Taps amount is more than 1500 (with boost)`);
	}

	reports += reportConditions.filter((c) => c === true).length;

	if (tapMultiplier === 1 && tapsAmount > 500) {
		tapsAmount = 500;
	}
	if (tapMultiplier !== 1 && tapsAmount > 1500) {
		tapsAmount = 1500;
	}

	if (energy > maxUserEnergy || energy < 0) {
		throw next(ApiError.BadRequest("Energy is beyond the limit"));
	}

	let validTokens = tapsAmount * tapMultiplier * user.spatulaLevel;
	const newBalance = Number((user.balance + validTokens).toFixed(2));

	user.burgerEnergy = energy;
	user.balance = newBalance;
	user.madeTaps += tapsAmount;
	user.lastTapTimestamp = now;
	user.reportsTap += reports;
	user.tapStart = tapStart;

	// добавление баланса рефералам
	if (user.EnterReferralCode && user.EnterReferralCode != "0") {
		let referrersCodes = user.EnterReferralCode.split(".").reverse();
		const referrers = await db.User.find({
			referralCode: { $in: referrersCodes },
		});
		const referrersInfo = referrers.map((ref) => {
			ref._doc.level = referrersCodes.indexOf(ref.referralCode) + 1;
			return ref._doc;
		});
		const referralLevels = await db.ReferralLevel.find({});

		for (const referrer of referrersInfo) {
			let percent = referralLevels.find((l) => l.level === referrer.level)?.rewardPercent;
			if (!percent) {
				percent = 0;
			}
			let rewardPercent = percent / 100;
			if (referrer.customReferralPercents.length > 0 && referrer.customReferralPercents[referrer.level - 1]) {
				rewardPercent = referrer.customReferralPercents[referrer.level - 1] / 100;
			}
			const referrerReward = Number((validTokens * rewardPercent).toFixed(2));

			await db.User.updateOne(
				{ referralCode: referrer.referralCode },
				{
					$inc: {
						balance: referrerReward,
						referralEarned: referrerReward,
					},
				}
			);
		}

		// update stats about referrers earnings in user
		user.referrersEarnings = user.referrersEarnings.map((referrer) => {
			const referrerInfo = referrersInfo.find((r) => r.tgId === referrer.tgId);
			let rewardPercent = referralLevels.find((l) => l.level === referrerInfo.level)?.rewardPercent;
			if (!rewardPercent) {
				rewardPercent = 0;
			}
			if (referrerInfo.customReferralPercents.length > 0 && referrerInfo.customReferralPercents[referrerInfo.level - 1]) {
				rewardPercent = referrerInfo.customReferralPercents[referrerInfo.level - 1];
			}
			return {
				...referrer,
				amount: (referrer?.amount ?? 0) + Number(((validTokens * rewardPercent) / 100).toFixed(2)),
			};
		});

		// give bonus to referrer
		let EnterReferralCode = user.EnterReferralCode;
		if (EnterReferralCode.includes(".")) {
			let codes = EnterReferralCode.split(".");
			EnterReferralCode = codes[codes.length - 1];
		}

		// начисление бонуса человеку который пригласил если пройдено нужное количество тапов
		if (user.gotRefferalBonus == false && user.madeTaps >= settings.minRefferalTapsCount) {
			user.gotRefferalBonus = true;
			let referrer = await db.User.findOneAndUpdate(
				{ referralCode: EnterReferralCode },
				{
					$inc: {
						balance: tgUser?.is_premium ? settings.referralReward : settings.referralRewardPremium,
						referralEarned: tgUser?.is_premium ? settings.referralReward : settings.referralRewardPremium,
					},
				},
				{ new: true }
			);
			if (!referrer) {
				return;
			}

			const referrerEarnings = user.referrersEarnings.find((ref) => {
				return ref.tgId == referrer.tgId;
			})
			if (referrerEarnings) {
				user.referrersEarnings.find((ref) => {
					return ref.tgId == referrer.tgId;
				}).amount += settings.referralReward
			}
		}
	}

	// проверка на открытие банера
	let openBanner = false;
	if (settings.showBannerAfterTaps && settings.showBannerAfterTaps.length > 0 && settings.bannerChatId) {
		if (!user.tapsForStartBanner) {
			user.tapsForStartBanner = settings.showBannerAfterTaps[0];
		}
		if (
			settings.showBannerAfterTaps.length > 0 &&
			user.madeTaps >= user.tapsForStartBanner &&
			settings.bannerChatId &&
			!user.completedTasks.includes(settings.preloader_task_id) &&
			settings.preloader_enabled &&
			!user.chatIds.includes(settings.bannerChatId) &&
			user.tapsForStartBanner <= settings.showBannerAfterTaps[settings.showBannerAfterTaps.length - 1]
		) {
			for (let i = 0; i < settings.showBannerAfterTaps.length; i++) {
				const el = settings.showBannerAfterTaps[i];
				if (user.madeTaps > el) {
					user.tapsForStartBanner = settings.showBannerAfterTaps[i + 1]
						? settings.showBannerAfterTaps[i + 1]
						: settings.showBannerAfterTaps[i] + 1;
				}
			}
			openBanner = true;
		}
	}

	// broadcast check
	if (settings.broadcastAfterTaps && settings.broadcastAfterTaps.length > 0) {
		if (!user.tapsForBroadcast) {
			user.tapsForBroadcast = settings.broadcastAfterTaps[0];
		}
		if (
			settings.broadcastAfterTaps.length > 0 &&
			user.madeTaps >= user.tapsForBroadcast &&
			settings.preloader_enabled &&
			user.tapsForBroadcast <= settings.broadcastAfterTaps[settings.broadcastAfterTaps.length - 1]
		) {
			sendMessageAfterTaps(db, tgBot, user, user.tapsForBroadcast);
			for (let i = 0; i < settings.broadcastAfterTaps.length; i++) {
				const el = settings.broadcastAfterTaps[i];
				if (user.madeTaps > el) {
					user.tapsForBroadcast = settings.broadcastAfterTaps[i + 1]
						? settings.broadcastAfterTaps[i + 1]
						: settings.broadcastAfterTaps[i] + 1;
				}
			}
		}
	}

	await user.save();

	return {
		balance: user.balance,
		burgerEnergy: user.burgerEnergy,
		position: userPosition,
		openBanner: openBanner,
		taps: user.madeTaps,
		tapsForBanner: user.tapsForStartBanner,
		notClaimedBalance: user.notClaimedBalance,
	};
};

module.exports = handleTaps;

async function sendMessageAfterTaps(db, bot, user, requiredTaps) {
	try {
		const sendMessageObject = await db.SendMessage.findOne({ type: `refferal${requiredTaps}` });
		if (!sendMessageObject) {
			return;
		}
		const randomMessage = sendMessageObject.messages[Math.floor(Math.random() * sendMessageObject.messages.length)];
		const settings = await db.Settings.findOne();
		const referralLevels = await db.ReferralLevel.find({});

		await broadcastMessage(
			db,
			bot,
			[user],
			randomMessage,
			"friends",
			["counttaps", "referralReward", "referralRewardPremium", "maxrefpercent", "currentTaps"],
			[
				user.madeTaps,
				settings.referralReward,
				settings.referralRewardPremium,
				referralLevels.find((el) => {
					return el.level == 1;
				})?.rewardPercent,
				user.madeTaps,
			],
			{
				counttaps: () => {
					return requiredTaps;
				},
				referralReward: () => {
					return settings.referralReward;
				},
				referralRewardPremium: () => {
					return settings.referralRewardPremium;
				},
				maxrefpercent: () => {
					return referralLevels.find((el) => {
						return el.level == 1;
					})?.rewardPercent;
				},
				currentTaps: () => {
					return user.madeTaps;
				},
			}
		);
	} catch (error) {
		console.log(error);
	}
}
