const db = require('../../configs/PostgreConfig');

module.exports = {
    getAll: async (catId) => {
        const res = await db.any('SELECT * FROM "Products" WHERE "CategoryID" = $1', catId);
        return res;
    },

    getOne: async (proId) => {
        const data = await db.oneOrNone('SELECT * FROM "Products" WHERE "ProductID"=$1', proId);
        return data;
    }
}