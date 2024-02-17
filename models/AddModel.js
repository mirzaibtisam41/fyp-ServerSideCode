const mongoose = require('mongoose');

const AddsSchema = new mongoose.Schema(
  {
    Add: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    imageFor: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
);

module.exports = mongoose.model('AddsSchema', AddsSchema);
