const { Router } = require("express");
const authMiddleware = require("../../../../middlewares/authMiddleware");

module.exports = Router({ mergeParams: true }).post("/upgrade/oilStorage", authMiddleware, async (req, res, next) => {
	try {
		const { db } = req;
		const tgId = req.user.id;

		let user = await db.User.findOne({ tgId });

		if (!user) {
			return res.status(404).json("User not found");
		}

		let upgradeCost = calculateUpgradeCost(user.oilStorageLevel);
		if (user.balance < upgradeCost) {
			return res.status(404).json("Insufficient balance for the burger upgrade");
		}

		const settings = await db.Settings.findOne();

		if (user.oilStorageLevel >= settings.maxOilStorageLevel) {
			return res.status(404).json("Maximum burger upgrade level reached");
		}

		user.balance -= upgradeCost;
		user.oilStorageLevel += 1;
		user.maxOilAmount = parseFloat((user.maxOilAmount * 2).toFixed(2));

		await user.save();

		res.json({ user, upgradeCost });
	} catch (error) {
		console.error("Error upgrading burger level:", error.message);
		next(error);
	}
});

function calculateUpgradeCost(upgradeLevel) {
	let upgradeCost = 650;

	switch (upgradeLevel) {
		case 1:
			upgradeCost = 650;
			break;
		case 2:
			upgradeCost = 2500;
			break;
		case 3:
			upgradeCost = 4000;
			break;
		case 4:
			upgradeCost = 6000;
			break;
		case 5:
			upgradeCost = 10000;
			break;
	}

	return parseFloat(upgradeCost.toFixed(0));
}
