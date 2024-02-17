const mongoose = require('mongoose');
const DealSchema = new mongoose.Schema(
  {
    DealProduct: {
      type: Object,
    },
  },
  {timestamps: true}
);

module.exports = mongoose.model('DealSchema', DealSchema);
