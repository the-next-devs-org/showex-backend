const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, getUserProfile, updateUserProfile } = require('../controllers/registerController');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/users', getUsers);

router.get("/profile/:id", getUserProfile);

router.put('/profileUpdate/:id', updateUserProfile); 

module.exports = router;
