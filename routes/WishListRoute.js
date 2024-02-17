const router = require('express').Router();
const {
  addToWishListProducts,
  getWishListOnRefresh,
  removeWishListItemsFunc,
} = require('../controller/WishListController');

router.post('/addToWishList', addToWishListProducts);
router.post('/getAllWishListItems', getWishListOnRefresh);
router.post('/removeWishListItem', removeWishListItemsFunc);

module.exports = router;
