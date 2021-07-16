const productModel = require("../models/productModel");
const slugify = require("slugify");

exports.createProduct = (req, res) => {
    const { name, price, offer, description, quantity, reviews, parent, active, brand } = req.body;
    if (!name || !price || !description || !quantity || !parent || !active || !brand) {
        return res.json({ message: "All fields must be required" });
    }
    const productPics = [];

    if (req.files.length > 0) {
        req.files.forEach(item => productPics.push({ img: item.path }));
    }

    const _product = new productModel({
        name, slug: slugify(name), price, offer, description, productPics, quantity, reviews, active, parent, brand
    });

    _product.save((error, data) => {
        if (error) throw error;
        if (data) {
            productModel.find().sort({ createdAt: -1 })
                .exec((error, products) => {
                    if (error) throw error;
                    if (products) return res.json(products);
                });
        }
    });
}

exports.getAllProducts = (req, res) => {
    productModel.find().sort({ createdAt: -1 })
        .exec((error, products) => {
            if (error) throw error;
            if (products) return res.json(products);
        });
}

exports.deleteProduct = (req, res) => {
    productModel.findOneAndDelete({ _id: req.body.productID })
        .exec((error, data) => {
            if (error) throw error;
            if (data) {
                productModel.find().sort({ createdAt: -1 })
                    .exec((error, products) => {
                        if (error) throw error;
                        if (products) return res.json(products);
                    });
            }
        })
}

exports.updateProductDetail = (req, res) => {
    const { _id, productData } = req.body;
    const { name, quantity, price, description, category, offer, parent, active, brand } = productData;
    const productObject = {};
    if (name !== null) { productObject.name = name; productObject.slug = name };
    if (quantity !== null) { productObject.quantity = quantity };
    if (price !== null) { productObject.price = price };
    if (description !== null) { productObject.description = description };
    if (category !== null) { productObject.category = category };
    if (offer !== null) { productObject.offer = offer };
    if (parent !== null) { productObject.parent = parent };
    if (active !== null) { productObject.active = active };
    if (brand !== null) { productObject.brand = brand };

    productModel.findOneAndUpdate(
        { _id: _id },
        { $set: productObject },
        { new: true }
    ).exec((error, data) => {
        if (error) throw error;
        if (data) {
            productModel.find().sort({ createdAt: -1 })
                .exec((error, products) => {
                    if (error) throw error;
                    if (products) return res.json(products);
                });
        };
    });
}