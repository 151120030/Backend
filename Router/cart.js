const express = require('express');
const router = express.Router();
const { cart } = require('../Controllers/cartConroller');

  

router.get('/get/:userId', cart.getProduct)
router.post('/add',cart.addToCart)
router.post('/updateQuantity',cart.updateQuantity);
router.delete('/removeItem',cart.removeCartItem);




module.exports = router;

