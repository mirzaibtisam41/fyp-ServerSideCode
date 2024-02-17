const router = require('express').Router();
const multer = require('multer');
const {
  postNewAdd,
  getAllAdds,
  deleteAdd,
} = require('../controller/AddsController');

// multer=====================================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/Adds');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({storage: storage});

router.post('/postAdd', upload.single('adds'), postNewAdd);
router.get('/getAdds', getAllAdds);
router.post('/deleteAdd', deleteAdd);

module.exports = router;
