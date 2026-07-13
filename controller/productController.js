const productModel = require('../models/productModel');
const slugify = require('slugify');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');

const allProducts = () => productModel.find().sort({createdAt: -1});

exports.createProduct = asyncHandler(async (req, res) => {
  const {name, price, offer, description, quantity, parent, active, brand} =
    req.body;

  if (!name || !price || !description || !quantity || !parent || !active || !brand) {
    throw new ApiError(400, 'All required fields must be provided');
  }

  const productPics = (req.files || []).map((file) => ({img: file.path}));

  await productModel.create({
    name,
    slug: slugify(name, {lower: true}),
    price,
    offer,
    description,
    productPics,
    quantity,
    active,
    parent,
    brand,
  });

  res.status(201).json(await allProducts());
});

exports.getAllProducts = asyncHandler(async (req, res) => {
  res.json(await allProducts());
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const deleted = await productModel.findByIdAndDelete(req.body.productID);
  if (!deleted) throw new ApiError(404, 'Product not found');
  res.json(await allProducts());
});

exports.updateProductDetail = asyncHandler(async (req, res) => {
  const {_id, productData} = req.body;
  if (!_id || !productData) throw new ApiError(400, 'Missing product data');

  const fields = [
    'name',
    'quantity',
    'price',
    'description',
    'category',
    'offer',
    'parent',
    'active',
    'brand',
  ];
  const update = {};
  fields.forEach((key) => {
    if (productData[key] !== null && productData[key] !== undefined) {
      update[key] = productData[key];
    }
  });
  // Keep the slug in sync with the name (old code set slug = raw name).
  if (update.name) update.slug = slugify(update.name, {lower: true});

  const updated = await productModel.findByIdAndUpdate(
    _id,
    {$set: update},
    {new: true}
  );
  if (!updated) throw new ApiError(404, 'Product not found');

  res.json(await allProducts());
});
