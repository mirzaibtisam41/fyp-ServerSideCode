// Lightweight typed error so controllers can signal an HTTP status cleanly.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;
