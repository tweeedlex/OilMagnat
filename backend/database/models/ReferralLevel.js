const mongoose = require("mongoose");

const referralLevelSchema = (module.exports = mongoose.Schema({
  level: { type: Number, required: true, unique: true },
  rewardPercent: { type: Number, required: true },
}));
