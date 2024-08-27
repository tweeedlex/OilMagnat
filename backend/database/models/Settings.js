const mongoose = require("mongoose");

const settingsSchema = (module.exports = mongoose.Schema({
	referralReward: { type: Number, default: 500 },
	referrerReward: { type: Number, default: 500 },
	maxOilStorageLevel: { type: Number, default: 6 },
	maxDerrickLevel: { type: Number, default: 5 },
}));
