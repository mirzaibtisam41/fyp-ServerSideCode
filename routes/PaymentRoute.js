const router = require('express').Router();
const crypto = require('crypto');
const {stripeSecret, paymentCurrency} = require('../config/keys');
const stripe = require('stripe')(stripeSecret);
const cartModel = require('../models/cartModel');
const {computeCartTotal} = require('../utils/cartTotals');
const {protect} = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');

// Charges the customer. The amount is computed on the server from their cart
// (the old route charged whatever `product.price` the client sent) and the
// idempotency key is stable per attempt (was Math.random()).
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const {token} = req.body;
    if (!token || !token.id) throw new ApiError(400, 'Payment token is required');

    const cart = await cartModel.findOne({user: req.user.email});
    if (!cart || cart.cartItems.length === 0) {
      throw new ApiError(400, 'Your cart is empty');
    }

    const {total} = computeCartTotal(cart.cartItems);
    if (total <= 0) throw new ApiError(400, 'Invalid order total');

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const charge = await stripe.charges.create(
      {
        amount: total, // smallest currency unit
        currency: paymentCurrency,
        customer: customer.id,
        receipt_email: token.email,
        description: 'Kartly order',
        shipping: token.card
          ? {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip,
              },
            }
          : undefined,
      },
      {idempotencyKey: crypto.randomUUID()}
    );

    if (charge.status !== 'succeeded') throw new ApiError(402, 'Payment failed');
    res.json({status: 'success', charge});
  })
);

module.exports = router;
