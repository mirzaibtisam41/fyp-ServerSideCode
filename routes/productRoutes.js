const router = require('express').Router();
const {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProductDetail,
} = require('../controller/productController');
const {adminOnly} = require('../middleware/auth');
const createUploader = require('../middleware/upload');

const upload = createUploader('products');

router.post('/create', adminOnly, upload.array('productPics'), createProduct);
router.get('/getAllProducts', getAllProducts);
router.post('/deleteProduct', adminOnly, deleteProduct);
router.post('/updateProduct', adminOnly, updateProductDetail);

module.exports = router;
