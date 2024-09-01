const { Router } = require("express");
const authMiddleware = require("../../../middlewares/authMiddleware");

module.exports = Router({ mergeParams: true }).get("/mainPage", authMiddleware, async (req, res, next) => {
	try {
		const tgId = req.user.id;
		const { db } = req;

		const user = await db.User.findOne({ tgId });

		let derrickDurability = 0;
		const derrick = await db.Locations.findOne({ ownerTgId: tgId, locationNumber: 1 });
		if (derrick) {
			derrickDurability = derrick.derrickDurability;
		}
		res.json({ user, derrickDurability });
	} catch (error) {
		console.error("Error:", error.message);
		next(error);
	}
});
