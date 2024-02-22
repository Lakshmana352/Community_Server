const express = require('express');
const { createUser, signIn, getMe } = require('../controllers/userController');
const {authenticateToken} = require('../middleware/auth');

const router = express.Router();

router.post('/signup',createUser);
router.post('/signin',signIn);
router.get('/me',authenticateToken,getMe);

module.exports = router;