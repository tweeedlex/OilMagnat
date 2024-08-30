const mongoose = require("mongoose");

const LocationsSchema = (module.exports = mongoose.Schema({
	ownerTgId: { type: Number, required: true },
	locationId: { type: mongoose.Types.ObjectId, required: true },
	locationNumber: { type: Number, default: 1 },
	locationName: { type: String, default: null },
	locationBonus: { type: Number, default: 1 },
	isDerrickBought: { type: Boolean, default: false, required: true },
	derrickLevel: { type: Number, default: 1, required: true },
	derrickDurabilityRate: { type: Number, default: 1.4 },
	derrickMiningRate: { type: Number, default: 0.4, required: true },
	derrickDurability: { type: Number, default: 100 },
	isDerrickRepairing: { type: Boolean, default: false },
	isDerrickAvailable: { type: Boolean, default: true },
	boughtAt: { type: Date, default: new Date() },
}));
