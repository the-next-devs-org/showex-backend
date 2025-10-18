const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, getUserProfile, updateUserProfile, deleteUser, updateUserWithPassword,totalUserCount } = require('../controllers/registerController');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/users', getUsers);

router.get("/profile/:id", getUserProfile);

router.put('/profileUpdate/:id', updateUserProfile); 

router.delete('/userdelete/:id', deleteUser);

router.put('/updateUser/:id', updateUserWithPassword);

router.put('/totalusercount', totalUserCount);

module.exports = router;
