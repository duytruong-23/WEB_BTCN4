const productModel = require('../models/product');
const functionH = require('../../helpers/func_helpers');

class CategoryRouter {
    //[GET] /category/detail/page?CatID=
    async showProduct(req, res, next) {
        try {
            const products = await productModel.getAll(req.query.CatID);
            const page = parseInt(req.query.page);
            const page_size = 2;
            const productRender = functionH.paginate(products, page, page_size);
            const totalPages = Math.ceil(products.length / page_size);
            const pages = [];
            for (let i = 1; i <= totalPages; i++) {
                const page = {
                    CatName: req.query.CatName,
                    CatID: req.query.CatID,
                    number: i
                }
                pages.push(page);
            }
            res.render('category/detail', {
                products: productRender,
                CatName: req.query.CatName,
                CatID: req.query.CatID,
                page: pages,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CategoryRouter();