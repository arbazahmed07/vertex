const express = require("express");
const authRouter = express.Router();
const userController = require('../controller/userController');

authRouter
  .route('/signup')
  .post(userController.signup);

authRouter
  .route('/login')
  .post(userController.login);

authRouter
  .route("/forgotPassword")
  .post(userController.forgotPassword);

authRouter
  .route("/fetchUserByEmail")
  .get(userController.fetchUserByEmail);

authRouter
  .route("/updateUserProfile")
  .put(userController.updateUserProfile);

// Add the missing /all endpoint
authRouter
  .route("/all")
  .get(userController.getAllUsers);

module.exports = authRouter;
