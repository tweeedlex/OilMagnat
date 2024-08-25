const { Router } = require("express");
const authMiddleware = require("../../../middlewares/authMiddleware");
const adminMiddleware = require("../../../middlewares/adminMiddleware");

module.exports = Router({ mergeParams: true }).post("/add", authMiddleware, adminMiddleware, async (req, res, next) => {
	try {
		const { db } = req;
		const tgId = req.user.id;

		const user = await db.User.findOne({ tgId });

		if (!user) {
			return res.status(404).json("User not found");
		}

		user.balance += 50000000;
		await user.save();

		res.json(user);
	} catch (error) {
		console.error("Error adding balance:", error.message);
		next(error);
	}
});
