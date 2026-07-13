const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const {jwtSecret, jwtExpiresIn} = require('../config/keys');
const {hashPassword, verifyPassword, needsRehash} = require('../utils/password');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');

const signToken = (userId) =>
  jwt.sign({data: userId}, jwtSecret, {expiresIn: jwtExpiresIn});

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  imageUrl: user.imageUrl,
});

exports.signup = asyncHandler(async (req, res) => {
  const {name, imageUrl, email, password} = req.body;

  const existing = await userModel.findOne({email});
  if (existing) {
    // Previously this silently logged the existing user in without a
    // password check — an account-takeover hole. Now it's a clean conflict.
    throw new ApiError(409, 'An account with this email already exists');
  }

  const user = await userModel.create({
    name,
    imageUrl,
    email,
    isLogedin: true,
    password: await hashPassword(password),
  });

  const token = signToken(user._id);
  res.status(201).json({user: publicUser(user), token});
});

exports.signin = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  const user = await userModel.findOne({email});
  // Same generic message whether the email or the password is wrong.
  if (!user || !(await verifyPassword(password, user.password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Seamlessly upgrade legacy password hashes to bcrypt on successful login.
  if (needsRehash(user.password)) {
    user.password = await hashPassword(password);
    await user.save();
  }

  const token = signToken(user._id);
  res.json({token, user: publicUser(user)});
});

// Route is protected, so req.user is already the authenticated user.
exports.authUser = asyncHandler(async (req, res) => {
  res.json({user: publicUser(req.user)});
});

// Admin-only: list users without exposing password hashes.
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await userModel
    .find()
    .select('-password')
    .sort({createdAt: -1});
  res.json(users);
});
