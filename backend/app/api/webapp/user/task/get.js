const { Router } = require("express");
const authMiddleware = require("../../../middlewares/authMiddleware");
const {getUserTasksInfo} = require("../../../helpers/tasks")

module.exports = Router({ mergeParams: true }).get(
  "/user/task",
  authMiddleware,
  async (req, res, next) => {
    try {
      const tgId = req.user.id;
      const { db, ApiError } = req;
      const {tasks, availableReward, completedTasksAmount} = await getUserTasksInfo(db, tgId);
      res.json({ tasks, availableReward, completedTasksAmount });
    } catch (error) {
      console.error('Error:', error.message);
      next(error);
    }
  }
);
