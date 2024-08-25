const { Router } = require("express");
const authMiddleware = require("../../../middlewares/authMiddleware");

module.exports = Router({ mergeParams: true }).get("/user", authMiddleware, async (req, res, next) => {
	try {
		const tgId = req.user.id;
		const { db } = req;

		const user = await db.User.findOne({ tgId });

		let userPosition = await db.User.getPosition(db, tgId);

		if (!user) {
			return res.status(404).json("User not found");
		}

		res.json({ user, position: userPosition });
	} catch (error) {
		console.error("Error:", error.message);
		next(error);
	}
});
