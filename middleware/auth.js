const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config/keys');
const userModel = require('../models/userModel');
const adminModel = require('../models/adminModel');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('./asyncHandler');

// Accept the token from the Authorization header (preferred) or the request
// body — the existing clients send it in the body, so we support both.
const extractToken = (req) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) return header.slice(7);
  if (req.body?.token) return req.body.token;
  if (req.body?.headers?.token) return req.body.headers.token;
  return null;
};

const verify = (req) => {
  const token = extractToken(req);
  if (!token) throw new ApiError(401, 'Authentication required');
  try {
    const decoded = jwt.verify(token, jwtSecret);
    // User tokens carry { data: id }, admin tokens carry { _id: id }.
    return decoded.data || decoded._id || decoded.id;
  } catch {
    throw new ApiError(401, 'Invalid or expired session');
  }
};

// Requires a valid logged-in user; attaches req.user.
const protect = asyncHandler(async (req, res, next) => {
  const id = verify(req);
  const user = await userModel.findById(id).select('-password');
  if (!user) throw new ApiError(401, 'Account no longer exists');
  req.user = user;
  next();
});

// Requires the token to belong to an admin account; attaches req.admin.
const adminOnly = asyncHandler(async (req, res, next) => {
  const id = verify(req);
  const admin = await adminModel.findById(id).select('-password');
  if (!admin) throw new ApiError(403, 'Admin access required');
  req.admin = admin;
  next();
});

// Accepts either a user or an admin token (used by routes both roles hit,
// e.g. changing an order status). Attaches whichever matched.
const authAny = asyncHandler(async (req, res, next) => {
  const id = verify(req);
  const [user, admin] = await Promise.all([
    userModel.findById(id).select('-password'),
    adminModel.findById(id).select('-password'),
  ]);
  if (admin) req.admin = admin;
  else if (user) req.user = user;
  else throw new ApiError(401, 'Account no longer exists');
  next();
});

module.exports = {protect, adminOnly, authAny};
