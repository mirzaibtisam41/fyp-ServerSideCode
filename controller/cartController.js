const cartModel = require('../models/cartModel');
const orderModel = require('../models/OrdersModel');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const {computeCartTotal} = require('../utils/cartTotals');

// Always return a consistent { user, cartItems } shape, even for an empty
// cart — the old code left the request hanging when no cart doc existed.
const cartResponse = (email, cart) => ({
  user: email,
  cartItems: cart ? cart.cartItems : [],
});

exports.addToCartProducts = asyncHandler(async (req, res) => {
  const {product} = req.body;
  if (!product) throw new ApiError(400, 'Product is required');
  const email = req.user.email;

  const cart = await cartModel.findOneAndUpdate(
    {user: email},
    {$push: {cartItems: {product}}},
    {new: true, upsert: true, setDefaultsOnInsert: true}
  );

  res.json(cartResponse(email, cart));
});

exports.getCartOnRefresh = asyncHandler(async (req, res) => {
  const email = req.user.email;
  const cart = await cartModel.findOne({user: email});
  res.json(cartResponse(email, cart));
});

exports.removeCartItemsFunc = asyncHandler(async (req, res) => {
  const {cartItem} = req.body;
  const email = req.user.email;

  const cart = await cartModel.findOneAndUpdate(
    {user: email},
    {$pull: {cartItems: {_id: cartItem}}},
    {new: true}
  );

  res.json(cartResponse(email, cart));
});

exports.updateCartQuantityFunc = asyncHandler(async (req, res) => {
  const {products} = req.body;
  if (!Array.isArray(products)) throw new ApiError(400, 'Products are required');
  const email = req.user.email;

  const cart = await cartModel.findOneAndUpdate(
    {user: email},
    {$set: {cartItems: products}},
    {new: true}
  );

  res.json(cartResponse(email, cart));
});

// Turns the cart into an order after a successful payment. The total is
// recomputed server-side; only the Stripe charge comes from the request.
exports.shiftCartToOrders = asyncHandler(async (req, res) => {
  const {charge} = req.body;
  const email = req.user.email;

  const cart = await cartModel.findOne({user: email});
  if (!cart || cart.cartItems.length === 0) {
    throw new ApiError(400, 'Your cart is empty');
  }

  const products = cart.cartItems.map((item) => item.product);
  const {total} = computeCartTotal(cart.cartItems);

  await orderModel.create({user: email, products, total, charge});
  await cartModel.findOneAndDelete({user: email});

  const orders = await orderModel.find({user: email}).sort({createdAt: -1});
  res.json(orders);
});
