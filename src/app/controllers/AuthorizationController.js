const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: './src/.env' });
// const jwt = require('jsonwebtoken');
const jwtH = require('../../helpers/JWT_helpers');
const accountModel = require('../models/account');
const CALLBACK_URL = "https://localhost:3000";
const REDIRECT_URL = "https://localhost:3000";

class AuthorizationController {
    /*
    ************** Application Server ************************
    */
    //[GET] /authorization
    async request(req, res, next) {
        try {
            if (!req.cookies['accessToken']) {
                res.redirect(`https://localhost:54321/authorization/signin?callbackURL=${CALLBACK_URL}`,);
                return;
            }

            if (jwtH.isExpired(req.cookies['accessToken'], process.env.ACCESS_TOKEN_SECRET)) {
                const account = await accountModel.getAccount(req.cookies.username);
                const refreshToken = account.refreshToken;
                if (jwtH.isExpired(refreshToken, process.env.REFRESH_TOKEN_SECRET)) {
                    res.redirect(`https://localhost:54321/authorization/signin?callbackURL=${CALLBACK_URL}`,);
                    return;
                }

                const response = await fetch('https://localhost:54321/authorization/tokens', {
                    method: 'POST',
                    headers: {
                        // 'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: account.username,
                    }),
                });
                const tokens = await response.json();
                await accountModel.updateRefreshToken(account.username, tokens.refreshToken);
                res.cookie("accessToken", tokens.accessToken);
                res.cookie("username", account.username);
            }
            res.redirect(CALLBACK_URL);
        } catch (err) {
            next(err);
        }
    }

    //[POST] /authorization/callback
    async callback(req, res, next) {
        const accessToken = req.body.accessToken;
        const refreshToken = req.body.refreshToken;

        try {
            const decoded = jwtH.verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const result = await accountModel.updateRefreshToken(decoded.username, refreshToken);
            res.json({
                redirectURL: REDIRECT_URL
            });

        } catch (error) {
            next(error);
        }


    }
    /*
    ************** Authentication Server ************************
    */
    //[GET] /authorization/signin
    showSignInForm(req, res, next) {
        res.render('authorization/signin', {
            callbackURL: req.query.callbackURL
        });
    }

    //[POST] /authorization/signin
    async signInWithAccount(req, res, next) {
        const username = req.body.username;
        const password = req.body.password;
        const callbackURL = req.body.callbackURL;
        try {
            const account = await accountModel.getAccount(username);
            if (account === null) {
                let err = Error('Account has not existed!');
                next(err);
                return;
            }
            const checkPassword = await bcryptH.check(password, account.password);
            if (!checkPassword) {
                let err = Error('Password is wrong!');
                next(err);
                return;
            }
            const tokens = jwtH.generateTokens(account);
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
            const account = await accountModel.getAccount(username);
            const tokens = jwtH.generateTokens(account);
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