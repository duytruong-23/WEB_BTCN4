const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: './src/.env' });
// const jwt = require('jsonwebtoken');
const jwtH = require('../../helpers/JWT_helpers');
const accountModel = require('../models/account');
const userModel = require('../models/user');
const bcryptH = require('../../helpers/bcrypt_helpers');

const CALLBACK_URL = process.env.CALLBACK_URL;
const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL;

class AuthorizationController {
    /*
    ************** Application Server ************************
    */
    //[GET] /authorization
    async request(req, res, next) {
        try {
            if (!req.cookies['accessToken']) {
                res.redirect(`${AUTH_SERVER_URL}/authorization/signin?callbackURL=${CALLBACK_URL}`,);
                return;
            }

            if (jwtH.isExpired(req.cookies['accessToken'], process.env.ACCESS_TOKEN_SECRET)) {
                const account = await accountModel.getAccount(req.cookies.username);
                const refreshToken = account.Token;
                const username = account.Username;
                if (jwtH.isExpired(refreshToken, process.env.REFRESH_TOKEN_SECRET)) {
                    res.redirect(`${AUTH_SERVER_URL}/authorization/signin?callbackURL=${CALLBACK_URL}`,);
                    return;
                }

                const response = await fetch(`${AUTH_SERVER_URL}/authorization/tokens`, {
                    method: 'POST',
                    headers: {
                        // 'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username
                    }),
                });
                const tokens = await response.json();
                await accountModel.updateRefreshToken(username, tokens.refreshToken);
                res.cookie("accessToken", tokens.accessToken);
                res.cookie("username", username);
            }
            res.redirect(CALLBACK_URL);
        } catch (err) {
            next(err);
        }
    }

    /*
    ************** Authentication Server ************************
    */

    //[GET] /authorization/signup
    showSignUpForm(req, res, next) {
        res.render('user/signup', {
            layout: 'main2',
            showHeader: false,
        });
    }

    //[POST] /authorization/signup
    async signUp(req, res, next) {
        try {
            let userDB = await userModel.getAccount(req.body.username);
            if (userDB !== null) {
                let err = new Error('Account has existed. Please sign in!');
                next(err);
                return;
            }
            let id = await userModel.getAutoId();
            let password = await bcryptH.hashPassword(req.body.password);
            const user = {
                id: parseInt(id),
                name: req.body.name,
                username: req.body.username,
                address: req.body.address,
                password,
            };
            await userModel.writeUser(user);
            res.redirect('/');
        } catch (error) {
            next(error)
        }
    }



    //[GET] /authorization/signin
    showSignInForm(req, res, next) {
        res.render('user/signin', {
            layout: 'main2',
            callbackURL: req.query.callbackURL,
            showHeader: false,
        });
    }

    //[POST] /authorization/signin
    async signInWithAccount(req, res, next) {
        const username = req.body.username;
        const password = req.body.password;
        const callbackURL = req.body.callbackURL;
        const expAccessToken = req.body.expire;
        try {
            const account = await accountModel.getAccount(username);
            if (account === null) {
                let err = Error('Account has not existed!');
                next(err);
                return;
            }
            const checkPassword = await bcryptH.check(password, account.Password);
            if (!checkPassword) {
                let err = Error('Password is wrong!');
                next(err);
                return;
            }
            const tokens = jwtH.generateTokens(username, expAccessToken);
            await accountModel.updateRefreshToken(username, tokens.refreshToken);
            res.cookie("accessToken", tokens.accessToken);
            res.cookie("username", username);
            res.redirect(callbackURL);

        } catch (error) {
            next(error);
        }
    }

    //[POST] /authorization/tokens
    async getTokens(req, res, next) {
        const username = req.body.username;
        try {
            const tokens = jwtH.generateTokens(username, '5m');
            res.json(tokens);

        } catch (error) {
            next(error);
        }
    }

    //[GET] /authorization/signout
    async signOut(req, res, next) {
        try {
            const username = req.params.username;
            await accountModel.updateRefreshToken(username, null);
            res.clearCookie('accessToken');
            res.clearCookie('username');
            res.redirect(req.query.callbackURL);
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AuthorizationController();