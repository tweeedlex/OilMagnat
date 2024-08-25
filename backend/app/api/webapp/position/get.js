const { Router } = require("express");
const authMiddleware = require("../../../middlewares/authMiddleware");

module.exports = Router({ mergeParams: true }).get("/position", authMiddleware, async (req, res, next) => {
	try {
		const { db } = req;
		const tgId = req.user.id;

		if (!tgId) {
			return res.status(404).json("Отсутствует параметр tgId");
		}

		let userPosition = await db.User.getPosition(db, tgId);

		if (userPosition == 0) {
			return res.status(404).json("Пользователь не найден");
		}

		res.json({ position: userPosition });
	} catch (error) {
		console.error("Ошибка при получении позиции пользователя:", error);
		next(error);
	}
});
