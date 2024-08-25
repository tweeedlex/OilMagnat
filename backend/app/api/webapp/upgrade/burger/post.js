const { Router } = require("express");
const authMiddleware = require("../../../middlewares/authMiddleware");

module.exports = Router({ mergeParams: true }).post("/upgrade/burger", authMiddleware, async (req, res, next) => {
	try {
		const { db } = req;
		const tgId = req.user.id;

		let user = await db.User.findOne({ tgId });

		if (!user) {
			return res.status(404).json("User not found");
		}

		let upgradeCost = calculateUpgradeCost(user.burgerLevel);

		console.log(upgradeCost);

		if (user.balance < upgradeCost) {
			return res.status(404).json("Insufficient balance for the burger upgrade");
		}

		const settings = await db.Settings.findOne();

		if (user.burgerLevel >= settings.maxBurgerUpgradeLevel) {
			return res.status(404).json("Maximum burger upgrade level reached");
		}

		// const newUser = await db.User.findOneAndUpdate(
		// 	{ tgId },
		// 	{
		// 		$inc: {
		// 			balance: -upgradeCost,
		// 			burgerLevel: 1,
		// 			burgerEnergy: 500,
		// 		},
		// 	},
		// 	{ new: true }
		// );

		user.balance -= upgradeCost;
		user.burgerLevel += 1;
		user.burgerEnergy += 500;

		await user.save();

		let userPosition = await db.User.getPosition(db, tgId);

		user._doc.position = userPosition;

		res.json(user);
	} catch (error) {
		console.error("Error upgrading burger level:", error.message);
		next(error);
	}
});

function calculateUpgradeCost(upgradeLevel) {
	let upgradeCost = 1000;

	for (let level = 2; level <= upgradeLevel; level++) {
		if (level <= 10) {
			upgradeCost *= 1.5;
		} else if (level <= 20) {
			upgradeCost *= 1.3;
		} else if (level <= 50) {
			upgradeCost *= 1.15;
		} else {
			upgradeCost *= 1.15;
		}
	}

	return parseFloat(upgradeCost.toFixed(0));
}
