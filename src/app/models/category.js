const db = require('../../configs/PostgreConfig');

module.exports = {
    getAll: async () => {
        const rs = await db.any('SELECT * FROM "Categories"');
        return rs;
    },
    getName: async (CatID) => {
        const rs = await db.oneOrNone('SELECT "CatName" FROM "Categories" WHERE "CatID" = $1', CatID);
        return rs;
    },
    editName: async (category) => {
        const rs = await db.oneOrNone('UPDATE "Categories" SET "CatName" = $(CatName) WHERE "CatID" = $(CatID) RETURNING *', category);
        return rs;
    },
    delete: async (CatID) => {
        const rs = await db.oneOrNone('DELETE FROM "Categories" WHERE "CatID" = $1', CatID);
        return rs;
    },
    getAutoId: async () => {
        let ids = await db.any('SELECT "CatID" FROM "Categories"');
        ids = ids.map((id) => id.CatID);
        ids.sort();
        let i = 1;
        for (; i < ids[ids.length - 1]; i++) {
            if (!ids.includes(i)) {
                return i;
            }
        }

        return i + 1;
    },
    add: async (category) => {
        const rs = await db.oneOrNone('INSERT INTO public."Categories"("CatID", "CatName") VALUES($(CatID), $(CatName))', category);
        return rs;
    }
}