const router = require('express').Router();
const { addToCartProducts, getCartOnRefresh, removeCartItemsFunc, updateCartQuantityFunc, shiftCartToOrders } = require("../controller/cartController");

router.post("/addToCart", addToCartProducts);
router.post("/getAllCartItems", getCartOnRefresh);
router.post("/removeCartItem", removeCartItemsFunc);
router.post("/updateCartQuantity", updateCartQuantityFunc);
router.post('/cartToOrder', shiftCartToOrders);

module.exports = router;