const userModel = require('../models/user');
const categoryModel = require('../models/category');
const functionH = require('../../helpers/func_helpers');

class PageController {
    //[GET] /page/page=
    async show(req, res, next) {
        try {
            const categories = await categoryModel.getAll();
            const page = req.query.page;
            const page_size = 2;
            const categoriesRender = functionH.paginate(categories, page, page_size);
            const totalPages = Math.ceil(categories.length / page_size);
            const pages = [];
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            res.render('home', {
                categories: categoriesRender,
                username: req.cookies.username || "Account",
                page: pages
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new PageController();