const db = require('../../configs/PostgreConfig');
const tableName = "Account";

module.exports = {
    getAccount: async (username) => {
        let data = await db.oneOrNone(`SELECT * FROM "${tableName}" WHERE "username" = $1`, username);
        return data;
    },

    updateRefreshToken: async (username, token) => {
        let result = await db.oneOrNone(`UPDATE "${tableName}" SET "refreshToken"=$1 WHERE username=$2`, [token, username]);
        return result;
    },

}