const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken');
const { jwtSecret } = require("../config/keys");
const OrdersModel = require("../models/OrdersModel");

exports.getOrdersByUserFunc = (req, res) => {
    const { token } = req.body;
    if (token) {
        const decode = jwt.verify(token, jwtSecret);
        req.user = decode.data;
        userModel.findById({ _id: req.user })
            .exec((error, user) => {
                if (error) throw error
                if (user) {
                    OrdersModel.find({ user: user.email }).sort({ createdAt: -1 })
                        .exec((error, order) => {
                            if (error) throw error;
                            if (order) return res.json(order);
                        })
                }

            })
    }
}

exports.getAllOrdersFunc = (req, res) => {
    OrdersModel.find().sort({ createdAt: -1 })
        .exec((error, order) => {
            if (error) throw error;
            if (order) return res.json(order);
        })
}

exports.deleteOrder = (req, res) => {
    const { token, id } = req.body;
    if (token) {
        const decode = jwt.verify(token, jwtSecret);
        req.user = decode.data;
        userModel.findById({ _id: req.user })
            .exec((error, user) => {
                if (error) throw error
                if (user) {
                    OrdersModel.findOneAndDelete(
                        { _id: id },
                    ).exec((error, order) => {
                        if (error) throw error;
                        if (order) {
                            OrdersModel.find({ user: user.email })
                                .exec((error, orders) => {
                                    if (error) throw error;
                                    if (orders) return res.json(orders);
                                });
                        }
                    })
                }
            })
    }
}

exports.changeOrderStatus = (req, res) => {
    const { id, status } = req.body;
    OrdersModel.findOneAndUpdate(
        { _id: id },
        { $set: { status: status } },
        { new: true }
    ).exec((error, order) => {
        if (error) throw error;
        if (order) {
            OrdersModel.find().sort({ createdAt: -1 })
                .exec((error, orders) => {
                    if (error) throw error;
                    if (orders) return res.json(orders);
                });
        }
    })
}