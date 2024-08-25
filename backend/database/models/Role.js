const mongoose = require("mongoose");

const roleSchema = (module.exports = mongoose.Schema({
	name: { type: String, required: true, unique: true },
}));
