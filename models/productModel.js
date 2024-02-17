const mongoose = require('mongoose');
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    offer: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    parent: {
      type: String,
      required: true,
      trim: true,
    },
    productPics: [{img: {type: String}}],
    quantity: {
      type: String,
      required: true,
    },
    active: {
      type: String,
      required: true,
    },
    reviews: [],
    brand: {
      type: String,
      require: true,
    },
  },
  {timestamps: true}
);

module.exports = mongoose.model('productSchema', productSchema);
