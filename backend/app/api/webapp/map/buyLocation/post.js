const { Router } = require("express");
const { Types } = require("mongoose");
const ApiError = require("../../../../exceptions/api-error");

module.exports = Router({ mergeParams: true }).post("/map/buyLocation", async (req, res, next) => {
	try {
		const { db } = req;
		const { locationNumber } = req.body;
		const tgId = req.user.id;
		let locationListModel = db.LocationsList;
		let userLocationsModel = db.Locations;
		let userModel = db.User;

		let user = await userModel.findOne({ tgId });

		if (!user) {
			return res.status(404).json("User not found");
		}

		let location = await locationListModel.findOne({ locationNumber: locationNumber });

		if (!location) {
			return new ApiError(404, "Cannot find location to buy");
		}

		let userLocation = await userLocationsModel.findOne({ ownerTgId: tgId, locationId: location._id });
		if (userLocation) {
			return ApiError.BadRequest("This location is already bought");
		}

		if (user.balance < location.lendPrice) {
			return ApiError.BadRequest("Not enaught balance to buy");
		}

		userLocation = await userLocationsModel.create({
			ownerTgId: tgId,
			locationId: location._id,
			locationNumber: location.locationNumber,
			locationName: location.locationName,
		});

		res.json({ userLocation });
	} catch (error) {
		console.error("Error while buying location:", error);
		next(error);
	}
});
