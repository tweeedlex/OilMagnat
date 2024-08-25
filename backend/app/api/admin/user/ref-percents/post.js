const {Router} = require("express");

module.exports = Router({mergeParams: true}).post(
  "/admin/user/ref-percents",
  async (req, res, next) => {
    try {
      const {db, ApiError} = req;
      const {tgId, percents} = req.body;

      if (!tgId || !percents) {
        return next(ApiError.BadRequest("Missing required fields: tgId or percents"));
      }

      const user = await db.User.findOneAndUpdate({tgId}, {customReferralPercents: JSON.parse(percents)}, {new: true});

      if (!user) {
        return next(ApiError.BadRequest("User not found"));
      }

      return res.json(user);
    } catch (error) {
      next(error);
    }
  }
);
