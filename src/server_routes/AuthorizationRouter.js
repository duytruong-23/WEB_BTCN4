const express = require('express');
const router = express.Router();

const controller = require('../app/controllers/AuthorizationController');

/*
************** Application Server *******************
*/
router.get('/', controller.request);

module.exports = router