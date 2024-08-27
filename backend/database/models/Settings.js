const mongoose = require("mongoose");

const settingsSchema = (module.exports = mongoose.Schema({
	referralReward: { type: Number, default: 0 },
	referrerReward: { type: Number, default: 0 },
}));
