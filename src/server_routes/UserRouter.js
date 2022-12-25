const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticate = require('../middlewares/auth');

const userController = require('../app/controllers/UserController');

router.get('/account', authenticate, userController.showInfo);


router.get('/signout', userController.signOut);


module.exports = router;