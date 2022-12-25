const jwt = require('jsonwebtoken');


module.exports = {
    verifyToken: (token, secret) => {
        const decoded = jwt.verify(token, secret);
        return decoded;
    },

    isExpired: (token, secret) => {
        const decoded = jwt.decode(token, secret);
        if (Date.now() >= decoded.exp * 1000) {
            return true;
        }
        return false;
    },

    generateTokens: (username, expAccessToken) => {
        const payload = {
            username,
        };
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: expAccessToken || '5m'
            }
        )

        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: '2h'
            }
        )

        return { accessToken, refreshToken }
    }
}