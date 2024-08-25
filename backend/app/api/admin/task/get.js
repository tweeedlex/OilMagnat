const { Router } = require("express");

module.exports = Router({ mergeParams: true }).get("admin/tasks", async (req, res, next) => {
	try {
		const { db } = req;
		const tasks = await db.Task.find({}).sort({ order: -1 });
		res.json(tasks);
	} catch (error) {
		console.error("Error:", error.message);
		next(error);
	}
});
