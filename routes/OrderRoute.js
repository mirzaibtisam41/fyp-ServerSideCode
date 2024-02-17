const router = require('express').Router();
const {
  getOrdersByUserFunc,
  deleteOrder,
  getAllOrdersFunc,
  changeOrderStatus,
} = require('../controller/OrderController');

router.post('/ordersByUser', getOrdersByUserFunc);
router.post('/cancel', deleteOrder);
router.get('/allOrders', getAllOrdersFunc);
router.post('/changeStatusOrder', changeOrderStatus);

module.exports = router;
