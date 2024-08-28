const { Router } = require("express");
const authMiddleware = require("../../../../middlewares/authMiddleware");
const ApiError = require("../../../../exceptions/api-error");

module.exports = Router({ mergeParams: true }).get("/map/locations", authMiddleware, async (req, res, next) => {
	try {
		const { db } = req;
		const tgId = req.user.id;
		let locationListModel = db.LocationsList;
		let userLocationsModel = db.Locations;
		let userModel = db.User;

		let user = await userModel.findOne({ tgId });

		if (!user) {
			throw res.status(404).json("User not found");
		}

		let locationsList = await locationListModel.find();

		let userLocations = await userLocationsModel.find({ ownerTgId: tgId });

		locationsList = locationsList.map((location) => {
			location = location._doc;

			let matchingUserLocation = userLocations.find((userLocation) => userLocation.locationNumber === location.locationNumber);

			if (matchingUserLocation) {
				location.bought = true;
				location.boughtAt = matchingUserLocation.boughtAt;
			} else {
				location.bought = false;
				location.boughtAt = null;
			}

			return location;
		});

		res.json({ locationsList });
	} catch (error) {
		console.error("Error while buying a derrick:", error);
		next(error);
	}
});
