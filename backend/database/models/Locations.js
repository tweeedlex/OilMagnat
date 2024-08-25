const mongoose = require("mongoose");

const LocationsSchema = (module.exports = mongoose.Schema({
	ownerTgId: {type: mongoose.Types.ObjectId,, required: true },
    locationId: {type: mongoose.Types.ObjectId, required: true},
	isDerrickBought: { type: Boolean, default: false, required: true },
	derrickLevl: { type: Number, default: 1, required: true },
	derrickMiningRate: { type: Number, default: 0.05, required: true },
	boughtAt: { type: Date, default: new Date() },
}));
