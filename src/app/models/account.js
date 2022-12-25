const db = require('../../configs/PostgreConfig');
const tableName = "Users";

module.exports = {
    getAccount: async (username) => {
        let data = await db.oneOrNone(`SELECT "Username", "Password", "Token" FROM "${tableName}" WHERE "Username" = $1`, username);
        return data;
    },

    updateRefreshToken: async (username, token) => {
        let result = await db.oneOrNone(`UPDATE "${tableName}" SET "Token"=$1 WHERE "Username"=$2`, [token, username]);
        return result;
    },

}