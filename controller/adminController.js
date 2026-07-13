const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminModel');
const {jwtSecret, jwtExpiresIn} = require('../config/keys');
const {hashPassword, verifyPassword, needsRehash} = require('../utils/password');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');

const signToken = (adminId) =>
  jwt.sign({_id: adminId}, jwtSecret, {expiresIn: jwtExpiresIn});

const publicAdmin = (admin) => ({
  _id: admin._id,
  firstName: admin.firstName,
  lastName: admin.lastName,
  email: admin.email,
  role: admin.role,
  profilePic: admin.profilePic,
  fullName: `${admin.firstName} ${admin.lastName}`,
});

// Creating admins is restricted to existing admins (route is adminOnly).
exports.signup = asyncHandler(async (req, res) => {
  const {firstName, lastName, email, password} = req.body;

  const existing = await adminModel.findOne({email});
  if (existing) throw new ApiError(409, 'Admin already registered');

  await adminModel.create({
    firstName,
    lastName,
    email,
    password: await hashPassword(password),
  });

  res.status(201).json({message: 'Admin created successfully'});
});

exports.signin = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  const admin = await adminModel.findOne({email});
  if (!admin || !(await verifyPassword(password, admin.password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (needsRehash(admin.password)) {
    admin.password = await hashPassword(password);
    await admin.save();
  }

  const token = signToken(admin._id);
  res.json({token, user: publicAdmin(admin)});
});

// Admin updates their own profile (route is adminOnly → req.admin).
exports.updateProfile = asyncHandler(async (req, res) => {
  const {firstName, lastName, email, password} = req.body;
  const update = {};

  if (req.file) update.profilePic = req.file.path;
  if (firstName) update.firstName = firstName;
  if (lastName) update.lastName = lastName;
  if (email) update.email = email;
  if (password) update.password = await hashPassword(password);

  const admin = await adminModel
    .findByIdAndUpdate(req.admin._id, {$set: update}, {new: true})
    .select('-password');

  res.json(publicAdmin(admin));
});
