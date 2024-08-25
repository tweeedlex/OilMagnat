const {Router} = require("express");

module.exports = Router({mergeParams: true}).get(
  "/admin/user/search",
  async (req, res, next) => {
    try {
      const {db, ApiError} = req;
      const {username} = req.query;

      if (!username) {
        return next(ApiError.BadRequest("Missing username in query"));
      }

      let user = await db.User.findOne({tgUsername: username});

      if (!user) {
        return next(ApiError.BadRequest("User not found"));
      }

      const userInfo = {
        tgId: user.tgId,
        tgUsername: user.tgUsername,
        customReferralPercents: user.customReferralPercents,
      }

      return res.json(userInfo);
    } catch (error) {
      next(error);
    }
  }
);
