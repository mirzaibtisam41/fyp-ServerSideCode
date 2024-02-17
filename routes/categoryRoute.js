const router = require('express').Router();
const {
  create,
  getAll,
  getSubCategories,
  getAllByFiltering,
} = require('../controller/categoryController');

router.post('/create', create);
router.get('/all/get', getAll);
router.get('/all/get/filter', getAllByFiltering);
router.post('/get/subCategory', getSubCategories);

module.exports = router;
