const orderModel = require('../models/order');
const productModel = require('../models/product');

const carts = [];
class OrderController {
    //[Get] /order
    async getQuantity(req, res, next) {
        try {
            let quantity = 0;
            carts.forEach(el => {
                quantity += el.Quantity;
            });
            res.json({
                result: quantity
            });
        } catch (error) {
            next(error);
        }
    }


    //[POST] /order
    async addOrder(req, res, next) {
        try {
            const ProductID = req.body.ProductID;
            if (carts.length === 0) {
                const product = {
                    ProductID,
                    Quantity: 1
                };
                carts.push(product);
                res.json({
                    quantity: 1
                });
                return;
            }
            let check = false;
            for (let i = 0; i < carts.length; i++) {
                if (carts[i].ProductID === ProductID) {
                    carts[i].Quantity += 1;
                    check = true;
                    break;
                }
            }
            if (!check) {
                const product = {
                    ProductID,
                    Quantity: 1
                };
                carts.push(product);
            }

            let quantity = 0;
            carts.forEach(el => {
                quantity += el.Quantity;
            });
            res.json({
                quantity,
            });
        } catch (error) {
            console.log(error.message);
            next(error)
        }

    }
}

module.exports = new OrderController();