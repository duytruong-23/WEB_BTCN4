const express = require('express');
const router = express.Router();

const categoryController = require('../app/controllers/CategoryController');


router.get('/detail', categoryController.showProduct);
router.get('/edit', categoryController.showEditUI);
router.post('/edit', categoryController.updateCategory);
router.get('/delete', categoryController.delete);
router.get('/add', categoryController.showAddUI);
router.post('/add', categoryController.add);


module.exports = router;