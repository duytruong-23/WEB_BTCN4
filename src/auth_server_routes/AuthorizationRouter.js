const express = require('express');
const router = express.Router();

const controller = require('../app/controllers/AuthorizationController');

router.get('/signup', controller.showSignUpForm);
router.post('/signup', controller.signUp);

router.get('/signin', controller.showSignInForm);
router.post('/signin', controller.signInWithAccount);

router.post('/tokens', controller.getTokens);

router.get('/signout/:username', controller.signOut);

router.get('/', controller.request);

module.exports = router