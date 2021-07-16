const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken');
const { jwtSecret } = require("../config/keys");
const orderModel = require('../models/OrdersModel');

exports.addToCartProducts = (req, res) => {
    const { token, product } = req.body;

    if (token) {
        const decode = jwt.verify(token, jwtSecret);
        req.user = decode.data;
        if (req.user) {
            userModel.findById({ _id: req.user })
                .exec((error, user) => {
                    if (error) throw error
                    if (user) {
                        cartModel.findOne({ user: user.email })
                            .exec((error, userData) => {
                                if (error) throw error;
                                if (userData) {
                                    cartModel.findOneAndUpdate(
                                        { user: user.email },
                                        { $push: { cartItems: { product: product } } },
                                        { new: true },
                                    ).exec((error, data) => {
                                        if (error) throw error;
                                        if (data) return res.json(data);
                                    })
                                }
                                else if (!userData) {
                                    const newCart = new cartModel({
                                        user: user.email,
                                        cartItems: { product: product },
                                    });

                                    newCart.save((error, updatedCart) => {
                                        if (error) throw error;
                                        if (updatedCart) return res.json(updatedCart);
                                    });
                                }
                            })
                    }
                });
        }
    }

}

exports.getCartOnRefresh = (req, res) => {
    const token = req.body.headers.token;

    if (token) {
        const decode = jwt.verify(token, jwtSecret);
        req.user = decode.data;
        userModel.findById({ _id: req.user })
            .exec((error, user) => {
                if (error) throw error
                if (user) {
                    cartModel.findOne({ user: user.email })
                        .exec((error, cart) => {
                            if (error) throw error;
                            if (cart) return res.json(cart);
                        })
                }

            })
    }
}

exports.removeCartItemsFunc = (req, res) => {
    const { token, cartItem } = req.body;
    const decode = jwt.verify(token, jwtSecret);
    req.user = decode.data;
    userModel.findById({ _id: req.user })
        .exec((error, user) => {
            if (error) throw error
            if (user) {
                cartModel.findOneAndUpdate(
                    { user: user.email },
                    { $pull: { cartItems: { _id: cartItem } } },
                    { new: true }
                )
                    .exec((error, product) => {
                        if (error) throw error;
                        if (product) {
                            cartModel.findOne({ user: user.email })
                                .exec((error, cart) => {
                                    if (error) throw error;
                                    if (cart) return res.json(cart);
                                })
                        }
                    })
            }

        })
}

exports.updateCartQuantityFunc = (req, res) => {
    const { token, products } = req.body;
    const decode = jwt.verify(token, jwtSecret);
    req.user = decode.data;
    userModel.findById({ _id: req.user })
        .exec((error, user) => {
            if (error) throw error
            if (user) {
                cartModel.findOneAndUpdate(
                    { user: user.email },
                    { $set: { cartItems: products } },
                    { new: true }
                ).exec((error, cart) => {
                    if (error) throw error;
                    if (cart) return res.json(cart);
                })
            }
        })
}

exports.shiftCartToOrders = (req, res) => {
    const { token, total, charge } = req.body;
    const decode = jwt.verify(token, jwtSecret);
    req.user = decode.data;
    userModel.findById({ _id: req.user })
        .exec((error, user) => {
            if (error) throw error
            if (user) {
                cartModel.findOne({ user: user.email })
                    .exec((error, cart) => {
                        if (error) throw error;
                        if (cart) {
                            let cartProducts = [];
                            cart && cart.cartItems.forEach(item => cartProducts.push(item.product));
                            if (cartProducts.length > 0) {
                                const _order = new orderModel({
                                    user: user.email,
                                    products: cartProducts,
                                    total: total,
                                    charge: charge
                                })
                                _order.save((error, data) => {
                                    if (error) throw error;
                                    if (data) {
                                        cartModel.findOneAndDelete({ user: user.email })
                                            .exec((error, cartData) => {
                                                if (error) throw error;
                                                if (cartData) {
                                                    orderModel.find({ user: user.email }).sort({ createdAt: -1 })
                                                        .exec((error, dataAll) => {
                                                            if (error) throw error;
                                                            if (data) return res.json(dataAll);
                                                        })
                                                }
                                            })
                                    }
                                })
                            }
                        }
                    })
            }
        })
}