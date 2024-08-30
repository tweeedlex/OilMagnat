const { Router } = require("express");
const ApiError = require("../../../exceptions/api-error");
const authMiddleware = require("../../../middlewares/authMiddleware");
const { getWorkersPrice } = require("../../../helpers/traders");

module.exports = Router({ mergeParams: true }).post("/workers/hire", authMiddleware, async (req, res, next) => {
	try {
		const { db } = req;
		const { workerType, buyWith = 1 } = req.body; // buyWith 1 - за USD, 2 - за BBL
		const tgId = req.user.id;
		let userModel = db.User;
		if (!workerType) {
			return next(ApiError.BadRequest("workerType is required field"));
		}
		if (![1, 2, 3].includes(workerType)) {
			return next(ApiError.BadRequest("Invalid type of workerType field"));
		}
		if (![1, 2].includes(buyWith)) {
			return next(ApiError.BadRequest("Invalid type of buyWith field"));
		}

		let user = await userModel.findOne({ tgId });

		if (!user) {
			throw res.status(404).json("User not found");
		}

		if (workerType == 1) {
			if (user.repairWorkerLevel >= 5) {
				return next(ApiError.BadRequest("Max worker level reached"));
			}
			let workerPrice = getWorkersPrice(user.traderWorkerLevel + 1);
			if (user.balance <= workerPrice) {
				return next(ApiError.BadRequest("Not eaugh balance to hire worker"));
			}
			user.balance -= workerPrice;
			user.repairWorkerLevel += 1;
		} else if (workerType == 2) {
			if (user.traderWorkerLevel >= 5) {
				return next(ApiError.BadRequest("Max worker level reached"));
			}
			let workerPrice = getWorkersPrice(user.traderWorkerLevel + 1);
			if (user.balance <= workerPrice) {
				return next(ApiError.BadRequest("Not eaugh balance to hire worker"));
			}
			user.balance -= workerPrice;
			user.traderWorkerLevel += 1;
		} else if (workerType == 3) {
			if (user.consultantWorkerLevel >= 5) {
				return next(ApiError.BadRequest("Max worker level reached"));
			}
			let workerPrice = getWorkersPrice(user.traderWorkerLevel + 1);
			if (user.balance <= workerPrice) {
				return next(ApiError.BadRequest("Not eaugh balance to hire worker"));
			}
			user.balance -= workerPrice;
			user.consultantWorkerLevel += 1;
		}

		await user.save();

		res.json({ user });
	} catch (error) {
		console.error("Error while buying a worker:", error);
		next(error);
	}
});
