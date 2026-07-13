const router = require('express').Router();
const {
  addToWishListProducts,
  getWishListOnRefresh,
  removeWishListItemsFunc,
} = require('../controller/WishListController');
const {protect} = require('../middleware/auth');

router.use(protect);

router.post('/addToWishList', addToWishListProducts);
router.post('/getAllWishListItems', getWishListOnRefresh);
router.post('/removeWishListItem', removeWishListItemsFunc);

module.exports = router;
