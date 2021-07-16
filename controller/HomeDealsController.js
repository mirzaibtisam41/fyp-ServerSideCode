const ProductModel = require("../models/productModel");
const jwt = require('jsonwebtoken');
const { jwtSecret } = require("../config/keys");
const userModel = require("../models/userModel");

exports.AddProduct = (req, res) => {
    const { item } = req.body;

    ProductModel.findOneAndUpdate(
        { _id: item._id },
        { $set: { active: "In Deal" } },
        { new: true }
    ).exec((error, data) => {
        if (error) return res.json({ message: 'Something went wrong..!' });
        if (data) {
            ProductModel.find().sort({ createdAt: -1 })
                .exec((error, products) => {
                    if (error) return res.json({ message: 'Something went wrong..!' });
                    if (products) return res.json(products);
                });
        }
    });
}

exports.DeleteDealProducts = (req, res) => {
    ProductModel.findOneAndUpdate(
        { _id: req.body.id },
        { $set: { active: "Active", offer: 0 } },
        { new: true }
    ).exec((error, data) => {
        if (error) return res.json({ message: 'Something went wrong..!' });
        if (data) {
            ProductModel.find().sort({ createdAt: -1 })
                .exec((error, products) => {
                    if (error) return res.json({ message: 'Something went wrong..!' });
                    if (products) return res.json(products);
                });
        }
    });
}

exports.AddDiscountPrice = (req, res) => {
    const { offer, id } = req.body;
    ProductModel.findOneAndUpdate(
        { _id: id },
        { $set: { offer: offer } },
        { new: true }
    ).exec((error, data) => {
        if (error) return res.json({ message: 'Something went wrong..!' });
        if (data) {
            ProductModel.find().sort({ createdAt: -1 })
                .exec((error, products) => {
                    if (error) return res.json({ message: 'Something went wrong..!' });
                    if (products) return res.json(products);
                });
        }
    });
}

exports.postReview = (req, res) => {
    const { comment, star, detail, id, user, deal, token } = req.body;
    const decode = jwt.verify(token, jwtSecret);
    req.user = decode.data;
    userModel.findById({ _id: req.user })
        .exec((error, user) => {
            if (error) throw error
            if (user) {
                const reviewObject = {
                    userID: user._id,
                    userName: user.name,
                    userEmail: user.email,
                    comment: comment,
                    detail: detail,
                    star: star,
                    date: new Date()
                };
                ProductModel.findOneAndUpdate(
                    { _id: id },
                    { $push: { reviews: reviewObject } },
                    { new: true }
                ).exec((error, data) => {
                    if (error) return res.json({ error: "Server error" });
                    if (data) return res.json(data);
                });
            }
        })
}