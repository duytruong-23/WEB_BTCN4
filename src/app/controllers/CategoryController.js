const productModel = require('../models/product');
const categoryModel = require('../models/category');

class CategoryRouter {
    //[GET] /category/detail?CatID=
    async showProduct(req, res, next) {
        try {
            const products = await productModel.getAll(req.query.CatID);
            res.render('category/detail', {
                products: products,
                CatName: req.query.CatName,
                CatID: req.query.CatID
            });
        } catch (err) {
            next(err);
        }
    }

    //[GET] /category/edit?CatID=
    async showEditUI(req, res, next) {
        try {
            const CatName = await categoryModel.getName(req.query.CatID);
            res.render('category/edit', {
                CatName: CatName.CatName,
                CatID: req.query.CatID,
            });
        } catch (err) {
            next(err);
        }
    }

    //[POST] /category/edit
    async updateCategory(req, res, next) {
        try {
            console.log(req.body);
            const category = {
                CatName: req.body.CatName,
                CatID: req.body.CatID
            }
            const rs = await categoryModel.editName(category);
            res.redirect('/');
        } catch (err) {
            next(err);
        }
    }

    //[GET] /category/delete
    async delete(req, res, next) {
        try {
            const rs = await categoryModel.delete(req.query.CatID);
            res.redirect('/');
        } catch (err) {
            next(err);
        }
    }

    //[GET] /category/add
    async showAddUI(req, res, next) {
        try {
            const id = await categoryModel.getAutoId();
            res.render('category/add', {
                CatName: "",
                CatID: id,
            });
        } catch (err) {

        }
    }

    //[POST] /category/add
    async add(req, res, next) {
        try {
            const category = {
                CatID: req.body.CatID,
                CatName: req.body.CatName
            };
            const rs = await categoryModel.add(category);
            res.redirect('/');
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CategoryRouter();