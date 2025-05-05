const express = require('express');
const router = express.Router();
const { seller } = require('../Controllers/Sellerontroller');
const authorization = require('../Middleware/authorization');

  

router.post('/register-seller', seller.sellerRegister)
router.get('/getOrdersForSeller/:sellerId', seller.getOrdersForSeller)
router.get('/getSeller/:sellerId', seller.getSellerDetails);
router.get('/getAllSellers', seller.getAllSellers);


router.post('/login-seller', seller.login)
router.get('/dashboard/:sellerId', seller.dashboardData)

// router.get('/getLoggedinUser', user.getLoggedinUser)
// router.get('/getUserDetails/:userId', user.getUserDetail)










module.exports = router;

