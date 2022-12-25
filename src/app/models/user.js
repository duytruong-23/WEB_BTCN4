const db = require('../../configs/PostgreConfig');

module.exports = {
    getAll: async () => {
        const rs = db.any('SELECT * FROM "Users"');
        return rs;
    },
    getAutoId: async () => {
        let id = await db.any('SELECT "UserID" FROM "Users" ORDER BY "UserID" ASC');
        if (id.length === 0) {
            return 1;
        }
        id = id.map(el => el.UserID);
        let i = 1;
        for (; i < id.length; i++) {
            if (!id.includes(i)) {
                return i;
            }
        }
        return id[id.length - 1] + 1;
    },
    getAccount: async (username) => {
        let data = await db.oneOrNone('SELECT * FROM "Users" WHERE "Username" = $1', username);
        return data;
    },
    writeUser: async (user) => {
        let data = await db.one('INSERT INTO public."Users"("UserID", "Username", "Password", "FullName", "Address") VALUES ($(id), $(username), $(password), $(name), $(address)) RETURNING *', user);
        return data;
    },
}