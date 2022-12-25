const userModel = require('../models/user');
const { getAccount } = require('../models/user');
const bcrypt = require('../../helpers/bcrypt_helpers');
require('dotenv').config({ path: './src/.env' });



class UserController {

    //[GET] /user/account
    async showInfo(req, res, next) {
        try {
            const username = req.username;
            const account = await userModel.getAccount(username);
            res.render('user/account', {
                username: account.Username,
                fullname: account.FullName,
                address: account.Address
            })

        } catch (err) {
            next(err);
        }
    }

    //[GET] /user/signout
    signOut(req, res, next) {
        res.redirect(`${process.env.AUTH_SERVER_URL}/authorization/signout/${req.cookies.username}?callbackURL=${process.env.CALLBACK_URL}`)
    }


}

module.exports = new UserController();