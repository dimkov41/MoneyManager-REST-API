const router = require('express').Router();
const controllers = require('../controllers/controllers');
const auth = require('../utils/auth');
const userValidator = require('../utils/userValidator');

router.get('/login', controllers.user.get.login);

router.post('/profile', auth(), controllers.user.post.profile);

router.get('/register', controllers.user.get.register);

router.get('/logout', auth(), controllers.user.get.logout);

router.post('/login', userValidator, controllers.user.post.login);

router.post('/register', userValidator, controllers.user.post.register);

router.post('/refill', auth() ,controllers.user.post.refill);

module.exports = router;