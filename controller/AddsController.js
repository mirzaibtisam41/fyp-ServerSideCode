const addsModel = require('../models/AddModel');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');

const allAdds = () => addsModel.find().sort({createdAt: -1});

exports.postNewAdd = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'An image file is required');

  await addsModel.create({
    Add: req.file.path,
    type: req.file.mimetype,
    imageFor: req.body.type,
  });

  res.status(201).json(await allAdds());
});

exports.getAllAdds = asyncHandler(async (req, res) => {
  res.json(await allAdds());
});

exports.deleteAdd = asyncHandler(async (req, res) => {
  const deleted = await addsModel.findByIdAndDelete(req.body.AddID);
  if (!deleted) throw new ApiError(404, 'Banner not found');
  res.json(await allAdds());
});
