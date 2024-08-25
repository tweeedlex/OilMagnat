const {Router} = require("express");

module.exports = Router({mergeParams: true}).delete(
  "/admin/task",
  async (req, res, next) => {
    try {
      const {db, ApiError} = req;
      const {_id} = req.body
      if (!_id) {
        return next(ApiError.BadRequest('Missing _id'));
      }

      const taskToDelete = await db.Task.findOne({_id});

      if (!taskToDelete) {
        return next(ApiError.BadRequest('Task not found'));
      }

      await taskToDelete.remove();

      return res.json({message: 'Task deleted'});
    } catch (error) {
      next(error);
    }
  }
);
