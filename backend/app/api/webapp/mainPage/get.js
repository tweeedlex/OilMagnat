const { Router } = require("express");
const authMiddleware = require("../../../middlewares/authMiddleware");

module.exports = Router({ mergeParams: true }).get("/mainPage", authMiddleware, async (req, res, next) => {
	try {
		const tgId = req.user.id;
		const { db } = req;

		const user = await db.User.findOne({ tgId });

		const notClaimedOil = Math.floor(Math.random() * 10000) + 1;
		const derrickWear = Math.floor(Math.random() * 100) + 1;
		res.json({ user, notClaimedOil, derrickWear });
	} catch (error) {
		console.error("Error:", error.message);
		next(error);
	}
});
