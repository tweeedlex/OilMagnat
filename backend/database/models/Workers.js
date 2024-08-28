const mongoose = require("mongoose");

const Workerschema = (module.exports = mongoose.Schema({
	ownerTgId: { type: Number, required: true },
	workerLevel: { type: Number, required: true },
	workerName: { type: String, required: true },
	workerDescription: { type: String, default: "" },
	workerType: { type: Number, default: 0, required: true }, // тип робочого, 1 - ремонтник, 2 - трейдер, 3-консультант
	workerBonus: { type: Number, required: true },
	boughtAt: { type: Date, default: new Date() },
}));
