const jwtH = require('../helpers/JWT_helpers');
require('dotenv').config({ path: './src/.env' });

function authenticate(req, res, next) {
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

module.exports = authenticate;