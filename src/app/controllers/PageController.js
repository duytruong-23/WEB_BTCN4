const userModel = require('../models/user');
const categoryModel = require('../models/category');

class PageController {
    //[GET] /page/page=
    async show(req, res, next) {

        try {
            const categories = await categoryModel.getAll();
            categories.sort((a, b) => {
                if (a.CatID < b.CatID) return -1;
                else if (a.CatID > b.CatID) return 1;
                else return 0;
            });
            const categoriesRender = [];
            let mid = Math.floor(categories.length / 2);

            if (req.query.page === '1') {
                for (let i = 0; i < mid; i++) {
                    categoriesRender.push(categories[i]);
                }
            }
            else {
                for (let i = mid; i < categories.length; i++) {
                    categoriesRender.push(categories[i]);
                }
            }

            res.render('home', {
                categories: categoriesRender,
                username: req.cookies.username || "Account"
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new PageController();