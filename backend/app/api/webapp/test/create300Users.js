const { Router } = require("express");
const { register } = require("../../../helpers/auth");

module.exports = Router({ mergeParams: true }).get("/user/create-300", async (req, res, next) => {
	try {
		const { db, tgBot, ApiError } = req;
		let { EnterReferralCode, initData = {}, tgUser } = req.body;

		for (let i = 0; i < 300; i++) {
			tgUser = { id: 1234 + i, first_name: "user-" + i, username: "user-" + i };
			initData.user = tgUser;

			const user = await register(db, tgBot, EnterReferralCode, tgUser);
			user.isOilPumping = true;
			await user.save();

			for (let j = 1; j <= 3; j++) {
				let location = await db.LocationsList.findOne({ locationNumber: j });

				await db.Locations.create({
					ownerTgId: user.tgId,
					locationId: location._id,
					locationNumber: location.locationNumber,
					locationName: location.locationName,
					locationBonus: location.locationBonus,
					isDerrickBought: true,
				});
			}
		}

		res.json({ user });
	} catch (error) {
		next(error);
	}
});
