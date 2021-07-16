const router = require('express').Router();
const { AddProduct, DeleteDealProducts, AddDiscountPrice, postReview } = require("../controller/HomeDealsController");

router.post('/addProduct', AddProduct);
router.post("/deleteDealProduct", DeleteDealProducts);
router.post("/addDiscountPrice", AddDiscountPrice);
router.post("/postReview", postReview);

module.exports = router;