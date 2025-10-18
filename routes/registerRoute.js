const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, getUserProfile, updateUserProfile, deleteUser, updateUserWithPassword,totalUserCount,changePassword,updateProfile } = require('../controllers/registerController');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/users', getUsers);

router.get("/profile/:id", getUserProfile);

router.put('/profileUpdate/:id', updateUserProfile); 

router.put('/updateProfile/:id', updateProfile); 

router.delete('/userdelete/:id', deleteUser);

router.put('/updateUser/:id', updateUserWithPassword);

router.put('/totalusercount', totalUserCount);

router.put('/changePassword/:id', changePassword);

module.exports = router;
