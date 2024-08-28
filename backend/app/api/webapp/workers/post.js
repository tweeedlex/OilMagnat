const { Router } = require("express");
const ApiError = require("../../../exceptions/api-error");
const authMiddleware = require("../../../middlewares/authMiddleware");

module.exports = Router({ mergeParams: true }).post("/workers/hire", authMiddleware, async (req, res, next) => {
	try {
		const { db } = req;
		const { workerType } = req.body;
		const tgId = req.user.id;
		let workersListModel = db.WorkersList;
		let userWorkersModel = db.Workers;
		let userModel = db.User;
		if (!workerType) {
			return next(ApiError.BadRequest("workerType is required field"));
		}

		let user = await userModel.findOne({ tgId });

		if (!user) {
			throw res.status(404).json("User not found");
		}

		let workersList = await workersListModel.find({ workerType: workerType });

		let userWorkers = await userWorkersModel.find({ ownerTgId: tgId, workerType: workerType }).sort({ workerLevel: -1 }); // Сортировка по убыванию уровня workerLevel

		let highestUserLevelWorker = userWorkers[0] ? userWorkers[0].workerLevel : 0; // Так как мы ограничили до 1 записи, она будет первой

		if (highestUserLevelWorker >= workersList.length) {
			return next(new ApiError(404, "Maximum worker upgrade level reached"));
		}

		let newWorker = workersList.find((element) => {
			return element.workerLevel == highestUserLevelWorker + 1;
		});

		if (user.balance < newWorker.workerPriceUSD) {
			return next(new ApiError(404, "Insufficient balance for buying new worker"));
		}

		user.balance -= newWorker.workerPriceUSD;

		await userWorkersModel.create({
			ownerTgId: tgId,
			workerLevel: newWorker.workerLevel,
			workerName: newWorker.workerName,
			workerDescription: newWorker.workerDescription,
			workerType: newWorker.workerType,
			workerBonus: newWorker.workerBonus,
		});

		// user.oilStorageLevel += 1;
		// user.maxOilAmount = parseFloat((user.maxOilAmount * 2).toFixed(2));

		await user.save();

		userWorkers = await userWorkersModel.find({ ownerTgId: tgId, workerType: workerType });

		res.json({ user, userWorkers });
	} catch (error) {
		console.error("Error while buying a worker:", error);
		next(error);
	}
});
