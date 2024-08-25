const {Router} = require("express");

module.exports = Router({mergeParams: true}).post(
  "/user/role/:tgId",
  async (req, res, next) => {
    try {
      const {db, ApiError} = req;
      const { name } = req.body;
      const {tgId} = req.params;
      if (!name) {
        return next(ApiError.BadRequest("Missing field name"));
      }
      const user = await db.User.findOne({tgId});
      const role = await db.Role.findOne({name});
      user.roles.push(role.name);
      await user.save();

      res.json(user);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

