const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// Existing routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/forgotpassword', userController.forgotPassword);
router.get('/fetchUserByEmail', userController.fetchUserByEmail);
router.post('/updateUserProfile', userController.updateUserProfile);

// Add this new route for admin functionality
router.get('/getAllUsers', userController.getAllUsers);

module.exports = router;