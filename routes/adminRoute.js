const router = require("express").Router();
const { signup, signin, updateProfile } = require("../controller/adminController");
const { check } = require("express-validator");
const multer = require("multer");

// multer=====================================================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post("/signup", signup);

router.post("/signin", [
    check("email").isEmail().withMessage("Please, Enter a valid email"),
    check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 digits"),
], signin);

router.post('/updateProfile', upload.single('file'), updateProfile);

module.exports = router;