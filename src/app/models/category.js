const db = require('../../configs/PostgreConfig');

module.exports = {
    getAll: async () => {
        const rs = await db.any('SELECT * FROM "Categories" ORDER BY "CategoryID" ASC');
        return rs;
    },
}