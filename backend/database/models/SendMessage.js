const mongoose = require("mongoose");

const sendMessageSchema = (module.exports = mongoose.Schema({
  messages: { type: Array, required: true },
  type: { type: String, required: true }
}));
