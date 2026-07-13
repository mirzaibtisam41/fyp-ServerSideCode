const {nodeEnv} = require('../config/keys');

// 404 for unmatched routes.
const notFound = (req, res, next) => {
  res.status(404).json({message: `Route not found: ${req.method} ${req.originalUrl}`});
};

// Central error handler — every controller error funnels here, so we always
// return clean JSON instead of leaking stack traces or hanging.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid identifier';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)[0]?.message || 'Validation failed';
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} already exists` : 'Duplicate value';
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired session';
  }

  if (statusCode >= 500) {
    console.error(err);
    if (nodeEnv === 'production') message = 'Internal server error';
  }

  res.status(statusCode).json({message});
};

module.exports = {notFound, errorHandler};
