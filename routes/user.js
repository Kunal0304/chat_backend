const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authentication')
const UserController = require('../apis/UserController');

router.get('/user',authenticateToken, UserController.allUsers);
router.post('/user', UserController.registerUser);
router.post('/user/login', UserController.authUser);


module.exports = router;