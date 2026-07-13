const {validationResult} = require('express-validator');
const ApiError = require('../utils/ApiError');

// Runs after express-validator checks; turns any validation errors into a
// single 400 response instead of letting controllers inspect them ad hoc.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  throw new ApiError(400, errors.array()[0].msg);
};

module.exports = validate;
