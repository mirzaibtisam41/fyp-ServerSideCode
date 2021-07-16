const router = require("express").Router();
const { signup, signin, authUser, getAllUsers } = require("../controller/userController");
const { body } = require("express-validator");

router.post("/signup", [
    body("name").not().isEmpty().withMessage("Invalid Username"),
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 6 }).withMessage("Password is too short"),
], signup);

router.post("/signin", signin);
router.post("/authUser", authUser);
router.get('/getAllUser', getAllUsers)

module.exports = router;