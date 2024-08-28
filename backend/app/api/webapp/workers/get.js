const { Router } = require("express");
const ApiError = require("../../../exceptions/api-error");
const authMiddleware = require("../../../middlewares/authMiddleware");

module.exports = Router({ mergeParams: true }).get("/workers/get", authMiddleware, async (req, res, next) => {
	try {
		const { db } = req;
		const tgId = req.user.id;
		let workersListModel = db.WorkersList;
		let userWorkersModel = db.Workers;
		let userModel = db.User;

		let user = await userModel.findOne({ tgId });

		if (!user) {
			throw res.status(404).json("User not found");
		}

		let workersList = await workersListModel.find();

		let userWorkers = await userWorkersModel.find({ ownerTgId: tgId });

		workersList = workersList.map((worker) => {
			worker = worker._doc;

			let matchingUserWorker = userWorkers.find(
				(userWorker) => userWorker.workerType === worker.workerType && userWorker.workerLevel === worker.workerLevel
			);

			if (matchingUserWorker) {
				worker.bought = true;
				worker.boughtAt = matchingUserWorker.boughtAt;
			} else {
				worker.bought = false;
				worker.boughtAt = null;
			}

			return worker;
		});

		res.json({ workersList });
	} catch (error) {
		console.error("Error while buying a derrick:", error);
		next(error);
	}
});
