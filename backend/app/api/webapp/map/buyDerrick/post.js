const { Router } = require("express");
const ApiError = require("../../../../exceptions/api-error");
const authMiddleware = require("../../../../middlewares/authMiddleware");

module.exports = Router({ mergeParams: true }).post("/map/buyDerrick", authMiddleware, async (req, res, next) => {
	try {
		const { db } = req;
		const { locationNumber } = req.body;
		const tgId = req.user.id;
		let locationListModel = db.LocationsList;
		let userLocationsModel = db.Locations;
		let userModel = db.User;

		if (!locationNumber) {
			return next(ApiError.BadRequest(`"locationNumber" is required field`));
		}

		let user = await userModel.findOne({ tgId });

		if (!user) {
			throw res.status(404).json("User not found");
		}

		let location = await locationListModel.findOne({ locationNumber: locationNumber });
		if (!location) {
			throw new ApiError(404, "Cannot find location to buy");
		}

		let userLocation = await userLocationsModel.findOne({ ownerTgId: tgId, locationId: location._id });

		if (!userLocation) {
			throw ApiError.BadRequest("This location must be bought");
		}

		if (userLocation.isDerrickBought) {
			throw ApiError.BadRequest("This derrick is already bought");
		}

		if (user.balance < location.derrickPrice) {
			throw ApiError.BadRequest("Not enaught balance to buy");
		}

		userLocation = await userLocationsModel.findOneAndUpdate(
			{
				ownerTgId: tgId,
				locationId: location._id,
			},
			{
				isDerrickBought: true,
			},
			{ new: true }
		);

		res.json({ userLocation });
	} catch (error) {
		console.error("Error while buying a derrick:", error);
		next(error);
	}
});
