const {deliveryFee, freeDeliveryThreshold} = require('../config/keys');

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

// Authoritative order total, computed on the server from the cart contents so
// the charged/stored amount can never be dictated by a tampered client.
const computeCartTotal = (cartItems = []) => {
  let net = 0;
  cartItems.forEach((line) => {
    const p = line.product || {};
    const qty = num(p.quantity) || 1;
    net += Math.max(0, num(p.price) - num(p.offer)) * qty;
  });
  const delivery = net === 0 || net >= freeDeliveryThreshold ? 0 : deliveryFee;
  return {net, delivery, total: net + delivery};
};

module.exports = {computeCartTotal};
