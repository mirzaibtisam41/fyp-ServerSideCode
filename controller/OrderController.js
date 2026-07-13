const orderModel = require('../models/OrdersModel');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');

// User: their own orders.
exports.getOrdersByUserFunc = asyncHandler(async (req, res) => {
  const orders = await orderModel
    .find({user: req.user.email})
    .sort({createdAt: -1});
  res.json(orders);
});

// Admin: every order.
exports.getAllOrdersFunc = asyncHandler(async (req, res) => {
  const orders = await orderModel.find().sort({createdAt: -1});
  res.json(orders);
});

// User cancels their own order.
exports.deleteOrder = asyncHandler(async (req, res) => {
  const {id} = req.body;
  const order = await orderModel.findById(id);
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.user !== req.user.email) {
    throw new ApiError(403, 'You can only cancel your own orders');
  }
  await order.deleteOne();

  const orders = await orderModel
    .find({user: req.user.email})
    .sort({createdAt: -1});
  res.json(orders);
});

// Admins may set any status on any order; a user may only mark their own
// order as "Received". Returns the appropriate order list for each role.
exports.changeOrderStatus = asyncHandler(async (req, res) => {
  const {id, status} = req.body;
  const order = await orderModel.findById(id);
  if (!order) throw new ApiError(404, 'Order not found');

  if (req.admin) {
    order.status = status;
    await order.save();
    const orders = await orderModel.find().sort({createdAt: -1});
    return res.json(orders);
  }

  // Regular user path.
  if (order.user !== req.user.email) {
    throw new ApiError(403, 'You can only update your own orders');
  }
  if (status !== 'Received') {
    throw new ApiError(403, 'You can only mark an order as received');
  }
  order.status = 'Received';
  await order.save();

  const orders = await orderModel
    .find({user: req.user.email})
    .sort({createdAt: -1});
  res.json(orders);
});
