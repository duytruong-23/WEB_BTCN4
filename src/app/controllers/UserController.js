const userModel = require('../models/user');
const { getAccount } = require('../models/user');
const bcrypt = require('../../helpers/bcrypt_helpers');

class UserController {
    //[GET] /user/signup
    showSignUpForm(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('account');
            return;
        }
        res.render('user/signup');
    }

    //[GET] /user/signin
    showSignInForm(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('account');
            return;
        }
        res.render('user/signin');
    }


    //[GET] /user/account
    async showInfo(req, res, next) {
        try {
            const username = req.username;
            const account = await userModel.getAccount(username);
            res.render('user/account', {
                username: account.f_Username,
                email: account.f_Email,
                birthdate: account.f_DOB,
                fullname: account.f_Name
            })

        } catch (err) {
            next(err);
        }
    }

    //[GET] /user/signout
    signOut(req, res, next) {
        // req.logout(function (err) {
        //     if (err) {
        //         return next(err);
        //     }
        // });
        // res.redirect('/');
        res.redirect(`https://localhost:54321/authorization/signout/${req.cookies.username}?callbackURL=https://localhost:3000`)
    }


}

module.exports = new UserController();