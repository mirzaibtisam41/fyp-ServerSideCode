const mongoose = require('mongoose');
const wishListSchema = new mongoose.Schema(
  {
    user: {
      type: Object,
      required: true,
    },

    cartItems: [
      {
        product: {type: Object, required: true},
      },
    ],
  },
  {timestamps: true}
);

module.exports = mongoose.model('wishListSchema', wishListSchema);
