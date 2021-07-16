const router = require("express").Router();
const multer = require("multer");
const { createProduct, getAllProducts, deleteProduct, updateProductDetail } = require("../controller/productController");

// multer=====================================================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/products");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post("/create", upload.array('productPics'), createProduct);
router.get("/getAllProducts", getAllProducts);
router.post("/deleteProduct", deleteProduct);
router.post("/updateProduct", updateProductDetail);

module.exports = router;