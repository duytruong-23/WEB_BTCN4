const db = require('../../configs/PostgreConfig');
const tableName = "Order Details";

module.exports = {
    writeOne: async (order) => {
        let data = await db.one(`INSERT INTO public."${tableName}"("OrderID", "ProductID", "UnitPrice", "Quantity", "Discount") VALUES ($(OrderID), $(ProductID), $(UnitPrice), $(Quantity), $(Discount)) RETURNING *`, order);
        return data;
    },

    getAll: async () => {
        let data = await db.any(`SELECT * FROM public."${tableName}"`);
        return data;
    },

    getAutoId: async () => {
        let id = await db.any(`SELECT "OrderID" FROM "${tableName}" ORDER BY "OrderID" ASC`);
        if (id.length === 0) {
            return 1;
        }
        id = id.map(el => el.OrderID);
        let i = 1;
        for (; i < id.length; i++) {
            if (!id.includes(i)) {
                return i;
            }
        }
        return id[id.length - 1] + 1;
    },

    getOne: async (proId) => {
        const data = await db.oneOrNone(`SELECT * FROM "${tableName}" WHERE "ProductID"=$1`, proId);
        return data;
    },

    updateQuantity: async (Quantity, ProductID) => {
        let result = await db.oneOrNone(`UPDATE "${tableName}" SET "Quantity"=$1 WHERE "ProductID"=$2`, [Quantity, ProductID]);
        return result;
    }
}