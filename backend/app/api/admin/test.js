const { Router } = require("express");

module.exports = Router({ mergeParams: true }).get(
  "/admin",
  async (req, res, next) => {
    try {
      const { db, ApiError } = req;

      return res.json({ message: "You are admin" });
    } catch (error) {
      next(error);
    }
  }
);
