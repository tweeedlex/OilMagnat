const { Router } = require("express");
const ApiError = require("../../../exceptions/api-error");

module.exports = Router({ mergeParams: true }).post("/admin/derrick", async (req, res, next) => {
	try {
		const { db } = req;
		const { locationNumber, locationName, locationDescription, locationBonus, price = 0, locationType = 1 } = req.body;
		if (!locationNumber || !locationName || !locationDescription || !locationBonus) {
			return next(ApiError.BadRequest("missing required params"));
		}
		let newLocation = await db.LocationsList.create({
			locationNumber: locationNumber,
			locationName: locationName,
			locationDescription: locationDescription,
			locationBonus: locationBonus,
			locationType: locationType,
			lendPrice: price,
		});

		return res.json({ newLocation });
	} catch (error) {
		next(error);
	}
});
