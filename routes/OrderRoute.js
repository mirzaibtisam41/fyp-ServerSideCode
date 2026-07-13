const router = require('express').Router();
const {
  getOrdersByUserFunc,
  deleteOrder,
  getAllOrdersFunc,
  changeOrderStatus,
} = require('../controller/OrderController');
const {protect, adminOnly, authAny} = require('../middleware/auth');

router.post('/ordersByUser', protect, getOrdersByUserFunc);
router.post('/cancel', protect, deleteOrder);
router.get('/allOrders', adminOnly, getAllOrdersFunc);
// Both admins and users hit this; the controller enforces what each may do.
router.post('/changeStatusOrder', authAny, changeOrderStatus);

module.exports = router;
