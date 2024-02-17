const adminModel = require('../models/adminModel');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config/keys');
const {validationResult} = require('express-validator');

exports.signup = (req, res) => {
  adminModel.findOne({email: req.body.email}).exec((error, user) => {
    if (user)
      return res.status(400).json({
        message: 'Admin already registered',
      });

    const {firstName, lastName, email, password} = req.body;
    const hashedPassword = passwordHash.generate(password);

    const _admin = new adminModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    _admin.save((error, data) => {
      if (error)
        return res.status(400).json({
          message: 'Something went wrong',
        });

      if (data)
        return res.status(200).json({
          message: 'Admin Created Successfully',
        });
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.json({message: errors.array()[0].msg});

  adminModel.findOne({email: req.body.email}).exec((error, user) => {
    if (error) return res.json({error});
    if (!user)
      return res.json({
        message: 'Email address not match',
      });
    if (user) {
      const {_id, firstName, lastName, email, role, fullName, profilePic} =
        user;
      let isMatch = passwordHash.verify(req.body.password, user.password);
      if (isMatch) {
        let token = jwt.sign({_id: user._id}, jwtSecret, {expiresIn: '1d'});
        return res.json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            email,
            role,
            profilePic,
            fullName: `${firstName} ${lastName}`,
          },
        });
      }
      if (!isMatch) {
        return res.json({
          message: 'Invalid Password',
        });
      }
    }
  });
};

exports.updateProfile = (req, res) => {
  const {_id, firstName, lastName, email, password} = req.body;
  let path = null;
  if (req.file) path = req.file.path;

  let profileObject = {};
  if (path !== null) profileObject.profilePic = path;
  if (firstName) profileObject.firstName = firstName;
  if (lastName) profileObject.lastName = lastName;
  if (email) profileObject.email = email;
  if (password) {
    const hashedPassword = passwordHash.generate(password);
    profileObject.password = hashedPassword;
  }

  adminModel
    .findOneAndUpdate({_id: _id}, {$set: profileObject}, {new: true})
    .exec((error, data) => {
      if (error) return res.json(error);
      if (data) res.json(data);
    });
};
