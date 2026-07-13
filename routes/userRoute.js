const router = require('express').Router();
const {body} = require('express-validator');
const {
  signup,
  signin,
  authUser,
  getAllUsers,
} = require('../controller/userController');
const {protect, adminOnly} = require('../middleware/auth');
const {authLimiter} = require('../middleware/rateLimit');
const validate = require('../middleware/validate');

router.post(
  '/signup',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
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
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  signin
);

router.post('/authUser', protect, authUser);
router.get('/getAllUser', adminOnly, getAllUsers);

module.exports = router;
