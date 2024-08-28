const mongoose = require("mongoose");

const LocationsSchema = (module.exports = mongoose.Schema({
	ownerTgId: { type: Number, required: true },
	locationId: { type: mongoose.Types.ObjectId, required: true, unique: true },
	locationNumber: { type: Number, default: 1 },
	locationName: { type: String, default: null },
	isDerrickBought: { type: Boolean, default: false, required: true },
	derrickLevel: { type: Number, default: 1, required: true },
	derrickMiningRate: { type: Number, default: 0.4, required: true },
	boughtAt: { type: Date, default: new Date() },
}));
