const { Router } = require("express");
const adminMiddleware = require("../../../middlewares/adminMiddleware");
const authMiddleware = require("../../../middlewares/authMiddleware");

module.exports = Router({ mergeParams: true }).delete(
  "/users",
  authMiddleware,
  adminMiddleware,
  async (req, res, next) => {
    try {
      const { db } = req;
      await db.User.deleteMany({});
      return res.json({ message: "Users were removed successfully" });
    } catch (error) {
      next(error);
    }
  }
);