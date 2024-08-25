const ApiError = require("../exceptions/api-error");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers["authorization"].split(" ")[1];

    if (!token) {
      return next(ApiError.UnauthorizedError("No token provided"));
    }
    const initData = jwt.verify(token, process.env.JWT_SECRET);
    req.initData = initData;
    req.user = initData.user;
    next()
  } catch (error) {
    next(ApiError.UnauthorizedError("Authorization error"));
  }
}