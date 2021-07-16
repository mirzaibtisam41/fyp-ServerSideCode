const wishlistModal = require("../models/WishlistModal");
const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken');
const { jwtSecret } = require("../config/keys");

exports.addToWishListProducts = (req, res) => {
    const { token, product } = req.body;

    if (token) {
        const decode = jwt.verify(token, jwtSecret);
        req.user = decode.data;
        if (req.user) {
            userModel.findById({ _id: req.user })
                .exec((error, user) => {
                    if (error) throw error
                    if (user) {
                        wishlistModal.findOne({ user: user.email })
                            .exec((error, userData) => {
                                if (error) throw error;
                                if (userData) {
                                    wishlistModal.findOneAndUpdate(
                                        { user: user.email },
                                        { $push: { cartItems: { product: product } } },
                                        { new: true },
                                    ).exec((error, data) => {
                                        if (error) throw error;
                                        if (data) return res.json(data);
                                    })
                                }
                                else if (!userData) {
                                    const newCart = new wishlistModal({
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

exports.getWishListOnRefresh = (req, res) => {
    const token = req.body.headers.token;

    if (token) {
        const decode = jwt.verify(token, jwtSecret);
        req.user = decode.data;
        userModel.findById({ _id: req.user })
            .exec((error, user) => {
                if (error) throw error
                if (user) {
                    wishlistModal.findOne({ user: user.email })
                        .exec((error, cart) => {
                            if (error) throw error;
                            if (cart) return res.json(cart);
                        })
                }

            })
    }
}

exports.removeWishListItemsFunc = (req, res) => {
    const { token, cartItem } = req.body;
    const decode = jwt.verify(token, jwtSecret);
    req.user = decode.data;
    userModel.findById({ _id: req.user })
        .exec((error, user) => {
            if (error) throw error
            if (user) {
                wishlistModal.findOneAndUpdate(
                    { user: user.email },
                    { $pull: { cartItems: { _id: cartItem } } },
                    { new: true }
                )
                    .exec((error, product) => {
                        if (error) throw error;
                        if (product) {
                            wishlistModal.findOne({ user: user.email })
                                .exec((error, cart) => {
                                    if (error) throw error;
                                    if (cart) return res.json(cart);
                                })
                        }
                    })
            }

        })
}