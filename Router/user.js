const express = require('express');
const router = express.Router();
const { user } = require('../Controllers/userController');
const authorization = require('../Middleware/authorization');

  

router.post('/register', user.register)
router.post('/login', user.login)
router.get('/getLoggedinUser', user.getLoggedinUser)
router.get('/getUserDetails/:userId', user.getUserDetail)
router.post('/changepassword', authorization, user.changePassword)
router.post('/forgotPassword', user.forgotPassword)
router.post('/verifyOtp', user.verifyOtp)
router.post('/resetPassword', user.resetPassword)









module.exports = router;

