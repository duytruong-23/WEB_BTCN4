const express = require('express');
const router = express.Router();

const newsController = require('../app/controllers/HomeController');


router.get('/', newsController.show);



module.exports = router;