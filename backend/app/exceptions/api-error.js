module.exports = class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = [], data = []) {
    super();
    this.message = message;
    this.status = status;
    this.errors = errors;
    this.data = data;
  }

  static BadRequest(message, data = [], errors = []) {
    return new ApiError(400, message, errors, data);
  }

  static UnauthorizedError() {
    return new ApiError(401, "User is not authorized!");
  }

  static Forbidden() {
    return new ApiError(403, "User is not allowed to access this resource!");
  }

  static NotFound() {
    return new ApiError(404, "Resource not found!");
  }

  static InternalServerError() {
    return new ApiError(500, "Internal server error!");
  }
};