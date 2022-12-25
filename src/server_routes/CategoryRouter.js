const express = require('express');
const router = express.Router();

const categoryController = require('../app/controllers/CategoryController');


router.get('/detail', categoryController.showProduct);


module.exports = router;