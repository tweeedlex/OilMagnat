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

LocationsSchema.statics.getDerrickWear = async function (req, searchQuery) {
	let userModel = req.db.User;
	let locationsModel = req.db.Locations;
	return await locationsModel.aggregate([
		{
			$match: searchQuery,
		},
		{
			// $project: [...parcelModel.getFieldNamesDTO(), ...fields].reduce(
			$project: parcelModel.getFieldNamesDTO().reduce(
				(accumulator, currentValue) => ({
					...accumulator,
					[currentValue]: 1,
				}),
				{}
			),
		},
		// Sender
		{
			$lookup: {
				from: userModel.collection.collectionName,
				localField: "senderId",
				foreignField: "_id",
				as: "sender",
				pipeline: [
					{
						$project: userModel.getFieldNamesDTO().reduce(
							(accumulator, currentValue) => ({
								...accumulator,
								[currentValue]: 1,
							}),
							{}
						),
					},
				],
			},
		},
		{ $unwind: "$sender" },

		// Receiver
		{
			$lookup: {
				from: userModel.collection.collectionName,
				localField: "receiverId",
				foreignField: "_id",
				as: "receiver",
				pipeline: [
					{
						$project: userModel.getFieldNamesDTO().reduce(
							(accumulator, currentValue) => ({
								...accumulator,
								[currentValue]: 1,
							}),
							{}
						),
					},
				],
			},
		},
		{ $unwind: "$receiver" },
		// Receiver Address
		{
			$lookup: {
				from: addressModel.collection.collectionName,
				localField: "receiverAddressId",
				foreignField: "_id",
				as: "receiverAddress",
				pipeline: [
					{
						$project: addressModel.getFieldNamesDTO().reduce(
							(accumulator, currentValue) => ({
								...accumulator,
								[currentValue]: 1,
							}),
							{}
						),
					},
				],
			},
		},
		{ $unwind: "$receiverAddress" },
	]);
};
