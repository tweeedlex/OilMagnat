const mongoose = require("mongoose");

const MarketDealsSchema = (module.exports = mongoose.Schema({
	sellerTgId: { type: Number, required: true },
	sellerUsername: { type: String, default: "" },
	buyerTgId: { type: Number, required: true },
	buyerUsername: { type: String, default: "" },
	oilAmount: { type: Number, default: 0 },
	pricePerLiter: { type: Number, default: 0 },
	finalPrice: { type: Number, default: 0 },
	createdAt: { type: Date, default: new Date() },
}));
