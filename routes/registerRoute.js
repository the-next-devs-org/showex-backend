const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers } = require('../controllers/registerController');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/users', getUsers);

module.exports = router;
