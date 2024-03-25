const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');


const  {checkUser}  = require("../middlewares/authorization/session");

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/dashboard', homeController.getHomePage);

// User routes
module.exports = router;