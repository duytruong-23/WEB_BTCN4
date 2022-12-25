const express = require('express');
const router = express.Router();

const productController = require('../app/controllers/ProductController');
const { route } = require('./CategoryRouter');


router.get('/add', productController.showAddForm);
router.post('/add', productController.add);
router.get('/delete', productController.delete);
router.get('/thumbnail', productController.showThumbnail);
router.post('/thumbnail', productController.uploadAVT);

module.exports = router;