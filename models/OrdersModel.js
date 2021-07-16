const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    products: [],
    status: {
        type: String,
        default: "Send"
    },
    total: {
        type: Number,
        required: true
    },
    charge: {
        type: Object,
        required: true
    }
}, { timestamps: true });
module.exports = mongoose.model("orderSchema", orderSchema);