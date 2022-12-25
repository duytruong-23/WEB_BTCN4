const fs = require('fs');
let multer = require('multer');
const dir = './src/public/img/pid/';
const productModel = require('../models/product');
const categoryModel = require('../models/category');

class ProductController {
    //[GET] /product/add?CatID=
    showAddForm(req, res) {

        res.render('product/add', {
            CatID: req.query.CatID,
        });

    }

    //[POST] /product/add?CatID=
    async add(req, res, next) {
        try {
            const ProID = await productModel.getAutoId();

            const CatID = parseInt(req.query.CatID);
            const CatName = await categoryModel.getName(CatID);
            const product = {
                ProID,
                CatID,
                ProName: req.body.name,
                TinyDes: req.body.TinyDes,
                FullDes: req.body.FullDes,
                Price: req.body.Price,
                Quantity: 100
            }
            const rs = await productModel.add(product);
            res.redirect(`/category/detail?CatID=${CatID}&&CatName=${CatName}`);
        } catch (err) {
            next(err);
        }
    }

    //[GET] /product/delete?ProID=
    async delete(req, res, next) {
        try {
            const ProID = req.query.ProID;
            const CatID = parseInt(req.query.CatID);
            const CatName = await categoryModel.getName(CatID);
            const rs = await productModel.delete(req.query.ProID);
            fs.rmSync(dir + ProID, { recursive: true, force: true });
            res.redirect(`/category/detail?CatID=${CatID}&&CatName=${CatName}`);

        } catch (err) {
            next(err);
        }
    }

    //[GET] /product/thumbnail?ProID=
    showThumbnail(req, res, next) {
        res.render('product/thumbnail', {
            ProID: req.query.ProID,
            CatID: req.query.CatID
        });
    }

    //[POST] /product/thumbnail?ProID=&&CatID
    async uploadAVT(req, res, next) {
        try {
            const ProID = req.query.ProID;
            if (!fs.existsSync(dir + ProID)) {
                fs.mkdirSync(dir + ProID);
            }
            let storage = multer.diskStorage({
                destination: function (req, file, callback) {
                    callback(null, dir + ProID);
                },
                filename: function (req, file, callback) {

                    let name = 'main' + '.' + file.originalname.split('.').pop();

                    callback(null, name);
                }
            });
            const CatID = parseInt(req.query.CatID);
            const CatName = await categoryModel.getName(CatID);
            let upload = multer({ storage: storage }).single('thumbnail');
            await upload(req, res, err => {
                if (err) {
                    return next(err);
                }
            });
            res.redirect(`/category/detail?CatID=${CatID}&&CatName=${CatName}`);
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new ProductController();