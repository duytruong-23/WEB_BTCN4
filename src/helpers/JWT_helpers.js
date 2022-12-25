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
    }
}