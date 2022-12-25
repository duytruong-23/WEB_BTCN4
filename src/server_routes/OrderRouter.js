const express = require('express');
const router = express.Router();

const controller = require('../app/controllers/OrderController');

router.post('/', controller.addOrder);
router.get('/', controller.getQuantity);

module.exports = router
