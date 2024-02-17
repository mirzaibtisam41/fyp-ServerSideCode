const addsModal = require('../models/AddModel');

exports.postNewAdd = (req, res) => {
  const _Add = new addsModal({
    Add: req.file.path,
    type: req.file.mimetype,
    imageFor: req.body.type,
  });
  _Add.save((error, data) => {
    if (error) return res.json(error);
    if (data) {
      addsModal
        .find()
        .sort({createdAt: -1})
        .exec((error, data) => {
          if (error) return res.json(error);
          if (data) return res.json(data);
        });
    }
  });
};

exports.getAllAdds = (req, res) => {
  addsModal
    .find()
    .sort({createdAt: -1})
    .exec((error, data) => {
      if (error) return res.json(error);
      if (data) return res.json(data);
    });
};

exports.deleteAdd = (req, res) => {
  addsModal.findOneAndDelete({_id: req.body.AddID}).exec((error, data) => {
    if (error) return res.json(error);
    if (data) {
      addsModal
        .find()
        .sort({createdAt: -1})
        .exec((error, data) => {
          if (error) return res.json(error);
          if (data) return res.json(data);
        });
    }
  });
};
