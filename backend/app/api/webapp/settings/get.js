const {Router} = require("express");

module.exports = Router({mergeParams: true}).get(
  "/settings",
  async (req, res, next) => {
    try {
      const {db} = req;
      const settings = await db.Settings.findOne({});
      res.json(settings);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

