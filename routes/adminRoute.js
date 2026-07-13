const router = require('express').Router();
const {body} = require('express-validator');
const {signup, signin, updateProfile} = require('../controller/adminController');
const {adminOnly} = require('../middleware/auth');
const {authLimiter} = require('../middleware/rateLimit');
const validate = require('../middleware/validate');
const createUploader = require('../middleware/upload');

const upload = createUploader('admin');

// Creating a new admin requires an existing admin session.
router.post(
  '/signup',
  adminOnly,
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password')
      .isLength({min: 6})
      .withMessage('Password must be at least 6 characters'),
  ],
  validate,
  signup
);

router.post(
  '/signin',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  signin
);

router.post('/updateProfile', adminOnly, upload.single('file'), updateProfile);

module.exports = router;
