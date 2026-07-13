const router = require('express').Router();
const {
  postNewAdd,
  getAllAdds,
  deleteAdd,
} = require('../controller/AddsController');
const {adminOnly} = require('../middleware/auth');
const createUploader = require('../middleware/upload');

const upload = createUploader('Adds');

router.post('/postAdd', adminOnly, upload.single('adds'), postNewAdd);
router.get('/getAdds', getAllAdds);
router.post('/deleteAdd', adminOnly, deleteAdd);

module.exports = router;
