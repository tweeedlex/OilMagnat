const ApiError = require("../exceptions/api-error.js");

module.exports = async (req, res, next) => {
  try {
    const {db, user} = req
    const tgId = user.id
    const userData = await db.User.findOne({tgId})

    if (userData.roles.includes("ADMIN")) {
      return next()
    } else {
      return next(ApiError.Forbidden("User is restricted to access this route"))
    }
  } catch (error) {
    next(error);
  }
}
