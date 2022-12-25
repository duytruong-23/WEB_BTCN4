const db = require('../../configs/PostgreConfig');

module.exports = {
    getAll: async () => {
        const rs = db.any('SELECT * FROM "Users"');
        return rs;
    },
    getAutoId: async () => {
        let id = await db.any('SELECT "f_ID" FROM "Users"');
        if (id == null) {
            return 1;
        }
        id = id.map(el => el.f_ID);
        let i = 1;
        for (; i < id.length; i++) {
            if (!id.includes(i)) {
                return i;
            }
        }
        return id[id.length - 1] + 1;
    },
    getAccount: async (username) => {
        let data = await db.oneOrNone('SELECT * FROM "Users" WHERE "f_Username" = $1', username);
        return data;
    },
    writeUser: async (user) => {
        let data = await db.one('INSERT INTO public."Users"("f_ID", "f_Username", "f_Password", "f_Name", "f_Email", "f_DOB", "f_Permission") VALUES ($(id), $(username), $(password), $(name), $(email), $(birthdate), $(permission)) RETURNING *', user);
        return data;
    },
}