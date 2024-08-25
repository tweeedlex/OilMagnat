const mongoose = require("mongoose");

const settingsSchema = (module.exports = mongoose.Schema({
	partnerTaskUsageLimit: { type: Number, default: 1 },
	referralReward: { type: Number, default: 10000 },
	freeHotDogAmount: { type: Number, default: 5 },
	freeEnergyDrinkAmount: { type: Number, default: 5 },
	maxDailyHotDogAmount: { type: Number, default: 25 },
	maxDailyEnergyDrinkAmount: { type: Number, default: 15 },
	energyDrinkDuration: { type: Number, default: 20 },
	hotDogDuration: { type: Number, default: 15 },
	maxBurgerUpgradeLevel: { type: Number, default: 25 },
	maxClawUpgradeLevel: { type: Number, default: 25 },
	maxShovelUpgradeLevel: { type: Number, default: 25 },
	maxSpatulaUpgradeLevel: { type: Number, default: 25 },
	minRefferalTapsCount: { type: Number, default: 10 },
	bannerChatId: { type: Number, default: null }, // -123456789
	showBannerAfterTaps: { type: Array, default: [100, 1000, 10000] }, // [100, 1000, 10000]
	preloader_enabled: { type: Boolean, default: false },
	preloader_task_id: { type: String, default: "" },
	// bannerReward: { type: Number, default: 5000 },
	// DailyStreak fields
	StartReward: { type: Number, default: 2000 },
	Step: { type: Number, default: 30 },
	AllDaysCount: { type: Number, default: 20 },
	BreakLevel: { type: Number, default: 10 },
	StepAfterBreak: { type: Number, default: 50 },
	CustomLevelReward: { type: Array, default: [] }, // [{day: 1, reward: 1000}, {day: 5, reward: 5999}]
	ClawInfluence: { type: Number, default: 0.1 },
	SecretKeyAddAttemptsCost: { type: Number, default: 100 },
	SecretKeyLimitAttempts: { type: Number, default: 0 },
	SecretKeyReward: { type: Number, default: 100000 },
	ComboReward: { type: Number, default: 50000 },
	MinClawAlert: { type: Number, default: 10 },
	referralRewardPremium: { type: Number, default: 20000 },
	minBalanceForStatsAvg: { type: Number, default: 5100 },
	BonusAmount: { type: Number, default: 50 },
	BonusMinLen: { type: Number, default: 30 },
	BonusAllowedChatIds: { type: Array, default: [] },
	broadcastAfterTaps: { type: Array, default: [100, 1000, 5000, 10000, 30000] }
}));
