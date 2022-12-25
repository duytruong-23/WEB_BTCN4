const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticate = require('../middlewares/auth');

const userController = require('../app/controllers/UserController');

router.get('/account', authenticate.signIn("http://localhost:20232/user/account"), userController.showInfo);

router.get('/inbox', authenticate.signIn("http://localhost:20232/user/inbox"), userController.inbox);
router.get('/signout', userController.signOut);


module.exports = router;