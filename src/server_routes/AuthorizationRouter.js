const express = require('express');
const router = express.Router();

const controller = require('../app/controllers/AuthorizationController');

/*
************** Application Server *******************
*/
router.post('/callback', controller.callback);
router.get('/', controller.request);

/*
************** Authentication Server *****************
*/


module.exports = router