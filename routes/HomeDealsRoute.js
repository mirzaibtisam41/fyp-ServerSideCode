const router = require('express').Router();
const {
  AddProduct,
  DeleteDealProducts,
  AddDiscountPrice,
  postReview,
} = require('../controller/HomeDealsController');
const {adminOnly, protect} = require('../middleware/auth');

router.post('/addProduct', adminOnly, AddProduct);
router.post('/deleteDealProduct', adminOnly, DeleteDealProducts);
router.post('/addDiscountPrice', adminOnly, AddDiscountPrice);
router.post('/postReview', protect, postReview);

module.exports = router;
