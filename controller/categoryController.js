const categoryModel = require("../models/categoryModel");
const { validationResult } = require("express-validator");
const slugify = require("slugify");

exports.create = (req, res) => {
    const { main, sub } = req.body;
    let category = null;
    if (!sub && main) category = new categoryModel({ name: main, slug: slugify(main) })
    if (sub && !main) category = new categoryModel({ name: sub, slug: slugify(sub) })
    if (sub && main) category = new categoryModel({ parent: main, slug: slugify(sub), name: sub })

    category.save((error, data) => {
        if (error) return res.json({ error });
        if (data) return res.json({ messageDone: "Category add Successfully", dataNew: data });
    });
}

exports.getAll = (req, res) => {
    categoryModel.find()
        .exec((error, data) => {
            if (error) return res.json({ message: error });
            if (data) {
                res.json(data);
            }
        });
}

// create category function
const createCategory = (categories, parent = null) => {
    const categoryList = [];
    let category;
    if (parent == null) {
        category = categories.filter(item => item.parent == undefined);
    }
    else {
        category = categories.filter(item => item.parent == parent);
    }

    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            parent: cate.parent ? cate.parent : undefined,
            children: createCategory(categories, cate.name)
        });
    }

    return categoryList;
}

// create category function end
exports.getAllByFiltering = (req, res) => {
    categoryModel.find()
        .exec((error, categories) => {
            if (error) return res.json({ message: error });
            if (categories) {
                const categoryList = createCategory(categories);
                res.json(categoryList);
            }
        });
}

exports.getSubCategories = (req, res) => {
    categoryModel.find({ parent: req.body.parent })
        .exec((error, data) => {
            if (error) return res.json(error);
            if (data) return res.json(data)
        });
}