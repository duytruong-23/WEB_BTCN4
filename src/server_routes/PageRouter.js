const express = require('express');
const router = express.Router();

const pageController = require('../app/controllers/PageController');

router.get('/', pageController.show);

module.exports = router;