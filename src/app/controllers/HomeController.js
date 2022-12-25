const userModel = require('../models/user');
const hbsH = require('../../helpers/hbs_helpers');


class HomeController {

    //[GET] 
    show(req, res, next) {

        res.redirect(`/page?page=1`);
    }

}

module.exports = new HomeController();