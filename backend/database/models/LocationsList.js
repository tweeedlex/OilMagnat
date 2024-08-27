const mongoose = require("mongoose");

const LocationListSchema = (module.exports = mongoose.Schema({
	// locationId: { type: mongoose.Types.ObjectId, required: true },
	locationNumber: { type: Number, default: 1 },
	locationName: { type: String, default: "" },
	locationDescription: { type: String, default: "" },
	locationType: { type: Number, default: 1 }, // тип локації, 1 - земля, 2 - вода
	lendPrice: { type: Number, default: 0 },
	derrickPrice: { type: Number, default: 0 },
	locationBonus: { type: Number, default: 0 },
}));
