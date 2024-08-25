const mongoose = require("mongoose");

const MarketGoodsSchema = (module.exports = mongoose.Schema({
	sellerTgId: { type: Number, required: true },
	sellerUsername: { type: String },
	oilAmount: { type: Number, default: 0 },
	// треба дописати по ТЗ ціну за галон і тд
}));
