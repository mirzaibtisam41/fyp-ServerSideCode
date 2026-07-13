const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const {clientOrigins} = require('./config/keys');
const {apiLimiter} = require('./middleware/rateLimit');
const {notFound, errorHandler} = require('./middleware/error');

const app = express();

// Security headers. crossOriginResourcePolicy is relaxed so the storefront
// on another origin can load product images served from /uploads.
app.use(helmet({crossOriginResourcePolicy: {policy: 'cross-origin'}}));

// CORS — restrict to configured origins; empty list allows all (dev only).
app.use(cors({origin: clientOrigins.length ? clientOrigins : true}));

// Body parsing with a sane size limit.
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({extended: false, limit: '1mb'}));

// Strip any keys containing operators ($, .) to block NoSQL injection.
app.use(mongoSanitize());

// Static assets (uploaded images).
app.use('/uploads', express.static('uploads'));

// Rate limiting for the API surface.
app.use('/api', apiLimiter);

// Health check.
app.get('/', (req, res) => res.json({status: 'ok', service: 'kartly-api'}));

// Routes.
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/admin', require('./routes/adminRoute'));
app.use('/api/category', require('./routes/categoryRoute'));
app.use('/api/product', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoute'));
app.use('/api/deals', require('./routes/HomeDealsRoute'));
app.use('/api/adds', require('./routes/AddsRoute'));
app.use('/api/wishlist', require('./routes/WishListRoute'));
app.use('/api/payment', require('./routes/PaymentRoute'));
app.use('/api/orders', require('./routes/OrderRoute'));

// 404 + centralized error handling (must be last).
app.use(notFound);
app.use(errorHandler);

module.exports = app;
