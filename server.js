const express = require("express");
const app = express();
const DB = require("./config/db");
const cors = require('cors');

// pic folder
app.use("/uploads", express.static("uploads"));
app.use(cors());

// databse connection
DB();

// body-parser
app.use(express.json({ extended: false }));

// routes
app.get("/", (req, res) => res.send("Server Running"));
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/admin", require("./routes/adminRoute"));
app.use("/api/category", require("./routes/categoryRoute"));
app.use("/api/product", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoute"));
app.use("/api/deals", require("./routes/HomeDealsRoute"));
app.use("/api/adds", require("./routes/AddsRoute"));
app.use("/api/wishlist", require('./routes/WishListRoute'));
app.use("/api/payment", require('./routes/PaymentRoute'));
app.use("/api/orders", require('./routes/OrderRoute'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server Running On Port ${PORT}`));