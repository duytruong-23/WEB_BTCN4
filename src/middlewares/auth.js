const jwtH = require('../helpers/JWT_helpers');
const accountModel = require('../app/models/account');
require('dotenv').config({ path: './src/.env' });
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: './src/.env' });


function authenticate(failRedirectURL) {
    return (req, res, next) => {
        try {

            if (req.cookies['accessToken'] && !jwtH.isExpired(req.cookies['accessToken'], process.env.ACCESS_TOKEN_SECRET)) {
                const decoded = jwtH.verifyToken(req.cookies['accessToken'], process.env.ACCESS_TOKEN_SECRET);
                req.username = decoded.username;
                next();
                return;
            }
            res.redirect('/authorization');
        } catch (err) {
            next(err);
        }
    }
}

function signIn(callbackURL) {
    return async (req, res, next) => {
        try {
            if (!req.cookies['accessToken']) {
                res.redirect(`${process.env.AUTH_SERVER_URL}/authorization/signin?callbackURL=${callbackURL}`);
                return;
            }

            if (jwtH.isExpired(req.cookies['accessToken'], process.env.ACCESS_TOKEN_SECRET)) {
                const account = await accountModel.getAccount(req.cookies.username);
                const refreshToken = account.Token;
                const username = account.Username;
                if (jwtH.isExpired(refreshToken, process.env.REFRESH_TOKEN_SECRET)) {
                    res.redirect(`${process.env.AUTH_SERVER_URL}/authorization/signin?callbackURL=${callbackURL}`,);
                    return;
                }

                const response = await fetch(`${process.env.AUTH_SERVER_URL}/authorization/tokens`, {
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
                req.username = username;
                next();
                return;
            }
            // res.redirect(callbackURL);
            if (req.cookies['accessToken'] && !jwtH.isExpired(req.cookies['accessToken'], process.env.ACCESS_TOKEN_SECRET)) {
                const decoded = jwtH.verifyToken(req.cookies['accessToken'], process.env.ACCESS_TOKEN_SECRET);
                req.username = decoded.username;
                next();
                return;
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = { authenticate, signIn };