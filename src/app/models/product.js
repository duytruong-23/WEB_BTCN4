const db = require('../../configs/PostgreConfig');

module.exports = {
    getAll: async (catId) => {
        const res = await db.any('SELECT * FROM "Products" WHERE "CatID" = $1', catId);
        return res;
    },

    add: async (product) => {
        const result = await db.oneOrNone('INSERT INTO public."Products"("ProID", "ProName", "TinyDes", "FullDes", "Price", "CatID", "Quantity")VALUES ($(ProID), $(ProName), $(TinyDes), $(FullDes), $(Price), $(CatID), $(Quantity)) RETURNING *', product);
        return result;
    },

    getAutoId: async () => {
        let id = await db.any('SELECT "ProID" FROM "Products"');
        if (id == null) {
            return 1;
        }
        id = id.map(el => el.ProID);
        let i = 1;
        for (; i < id.length; i++) {
            if (!id.includes(i)) {
                return i;
            }
        }
        return id[id.length - 1] + 1;
    },
    delete: async (ProID) => {
        const rs = await db.oneOrNone('DELETE FROM "Products" WHERE "ProID" = $1', ProID);
        return rs;
    },
}