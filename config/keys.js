// Central configuration, sourced entirely from environment variables.
// (Previously secrets were hardcoded here — see .env / .env.example.)

const required = ['MONGODB_URI', 'JWT_SECRET'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  // Fail fast rather than starting with a broken/insecure config.
  console.error(
    `Missing required environment variables: ${missing.join(', ')}. ` +
      `Copy .env.example to .env and fill it in.`
  );
  process.exit(1);
}

const splitList = (value) =>
  (value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5001,
  mongoURI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  stripeSecret: process.env.STRIPE_SECRET_KEY,
  paymentCurrency: process.env.PAYMENT_CURRENCY || 'usd',
  clientOrigins: splitList(process.env.CLIENT_ORIGINS),
  deliveryFee: Number(process.env.DELIVERY_FEE) || 100,
  freeDeliveryThreshold: Number(process.env.FREE_DELIVERY_THRESHOLD) || 5000,
};
