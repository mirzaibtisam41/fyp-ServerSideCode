const router = require('express').Router();
const {
  create,
  getAll,
  getSubCategories,
  getAllByFiltering,
} = require('../controller/categoryController');
const {adminOnly} = require('../middleware/auth');

router.post('/create', adminOnly, create);
router.get('/all/get', getAll);
router.get('/all/get/filter', getAllByFiltering);
router.post('/get/subCategory', getSubCategories);

module.exports = router;
