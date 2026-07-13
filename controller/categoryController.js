const categoryModel = require('../models/categoryModel');
const slugify = require('slugify');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.create = asyncHandler(async (req, res) => {
  const {main, sub} = req.body;

  let payload;
  if (main && !sub) payload = {name: main, slug: slugify(main, {lower: true})};
  else if (sub && !main) payload = {name: sub, slug: slugify(sub, {lower: true})};
  else if (main && sub)
    payload = {parent: main, name: sub, slug: slugify(sub, {lower: true})};
  else throw new ApiError(400, 'Category name is required');

  const data = await categoryModel.create(payload);
  res.status(201).json({messageDone: 'Category added successfully', dataNew: data});
});

exports.getAll = asyncHandler(async (req, res) => {
  const data = await categoryModel.find();
  res.json(data);
});

// Builds the nested category tree consumed by the storefront header.
const buildTree = (categories, parent = null) =>
  categories
    .filter((c) => (parent == null ? c.parent == null : c.parent === parent))
    .map((c) => ({
      _id: c._id,
      name: c.name,
      slug: c.slug,
      parent: c.parent || undefined,
      children: buildTree(categories, c.name),
    }));

exports.getAllByFiltering = asyncHandler(async (req, res) => {
  const categories = await categoryModel.find();
  res.json(buildTree(categories));
});

exports.getSubCategories = asyncHandler(async (req, res) => {
  const data = await categoryModel.find({parent: req.body.parent});
  res.json(data);
});
