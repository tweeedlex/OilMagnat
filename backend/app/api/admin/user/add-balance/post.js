const {Router} = require("express");

module.exports = Router({mergeParams: true}).post(
  "/admin/user/add-balance",
  async (req, res, next) => {
    try {
      const {db, ApiError} = req;
      const {tgId, amount} = req.body;

      const user = await db.User.findOneAndUpdate({tgId}, {$inc: {balance: amount}}, {new: true});
      if (!user) {
        return next(ApiError.BadRequest("User not found"));
      }

      return res.json({tgUsername: user.tgUsername, nickName: user.nickName, tgId: user.tgId, balance: user.balance});
    } catch (error) {
      next(error);
    }
  }
);
