const productModel = require('../models/productModel');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');

const allProducts = () => productModel.find().sort({createdAt: -1});

// Admin: mark a product as being "In Deal".
exports.AddProduct = asyncHandler(async (req, res) => {
  const {item} = req.body;
  const updated = await productModel.findByIdAndUpdate(
    item?._id,
    {$set: {active: 'In Deal'}},
    {new: true}
  );
  if (!updated) throw new ApiError(404, 'Product not found');
  res.json(await allProducts());
});

// Admin: remove a product from deals.
exports.DeleteDealProducts = asyncHandler(async (req, res) => {
  const updated = await productModel.findByIdAndUpdate(
    req.body.id,
    {$set: {active: 'Active', offer: 0}},
    {new: true}
  );
  if (!updated) throw new ApiError(404, 'Product not found');
  res.json(await allProducts());
});

// Admin: set a discount amount on a product.
exports.AddDiscountPrice = asyncHandler(async (req, res) => {
  const {offer, id} = req.body;
  const updated = await productModel.findByIdAndUpdate(
    id,
    {$set: {offer}},
    {new: true}
  );
  if (!updated) throw new ApiError(404, 'Product not found');
  res.json(await allProducts());
});

// User: post a review. The route is protected, so req.user is trusted here
// rather than trusting user identity from the request body.
exports.postReview = asyncHandler(async (req, res) => {
  const {comment, star, detail, id} = req.body;
  if (!comment || !detail || !star) {
    throw new ApiError(400, 'Comment, detail and rating are required');
  }

  const review = {
    userID: req.user._id,
    userName: req.user.name,
    userEmail: req.user.email,
    comment,
    detail,
    star,
    date: new Date(),
  };

  const product = await productModel.findByIdAndUpdate(
    id,
    {$push: {reviews: review}},
    {new: true}
  );
  if (!product) throw new ApiError(404, 'Product not found');

  res.json(product);
});
