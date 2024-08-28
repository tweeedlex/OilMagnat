const mongoose = require("mongoose");

const WorkersListSchema = (module.exports = mongoose.Schema({
	workerLevel: { type: Number, required: true },
	workerName: { type: String, required: true },
	workerDescription: { type: String, default: "" },
	workerType: { type: Number, default: 0, required: true }, // тип робочого, 1 - ремонтник, 2 - трейдер, 3-консультант
	workerPriceUSD: { type: Number, required: true },
	workerPriceBBL: { type: Number, required: true },
	workerBonus: { type: Number, required: true },
}));
