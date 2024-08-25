const mongoose = require("mongoose");

const taskSchema = (module.exports = mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String},
  link: {type: String, default: ""},
  reward: {type: Number, required: true},
  chatId: {type: Number, default: 0},
  isPartnership: {type: Boolean, default: false},
  isOthers: {type: Boolean, default: false},
  referralsNeeded: {type: Number, default: 0},
  timesClaimed: {type: Number, default: 0},
  maxClaimsLimit: {type: Number, default: 0},
  order: {type: Number, default: 0},
  hidden: {type: Boolean, default: false},
  image: {type: String, default: ""},
}));
