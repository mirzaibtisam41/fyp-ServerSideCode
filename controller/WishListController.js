const wishlistModel = require('../models/WishlistModal');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');

const wishlistResponse = (email, doc) => ({
  user: email,
  cartItems: doc ? doc.cartItems : [],
});

exports.addToWishListProducts = asyncHandler(async (req, res) => {
  const {product} = req.body;
  if (!product) throw new ApiError(400, 'Product is required');
  const email = req.user.email;

  const doc = await wishlistModel.findOneAndUpdate(
    {user: email},
    {$push: {cartItems: {product}}},
    {new: true, upsert: true, setDefaultsOnInsert: true}
  );

  res.json(wishlistResponse(email, doc));
});

exports.getWishListOnRefresh = asyncHandler(async (req, res) => {
  const email = req.user.email;
  const doc = await wishlistModel.findOne({user: email});
  res.json(wishlistResponse(email, doc));
});

exports.removeWishListItemsFunc = asyncHandler(async (req, res) => {
  const {cartItem} = req.body;
  const email = req.user.email;

  const doc = await wishlistModel.findOneAndUpdate(
    {user: email},
    {$pull: {cartItems: {_id: cartItem}}},
    {new: true}
  );

  res.json(wishlistResponse(email, doc));
});
