// Wraps an async route handler so any thrown/rejected error is forwarded to
// the central error handler instead of crashing the process or hanging.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
