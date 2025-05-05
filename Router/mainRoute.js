const express = require('express')
const router = express.Router();
const productRouter=require('./Products')
const userRouter=require('./user')
const cartRouter=require('./cart')
const orderRouter=require('./order')
const addressRouter=require('./address')
const categoryRouter=require('./category')
const wishlistRouter=require('./wishlist')
const sellerRouter=require('./seller')





// const authorization = require('../Middleware/authorization');


router.use('/products', productRouter)
router.use('/user', userRouter)
router.use('/cart', cartRouter)
router.use('/order', orderRouter)
router.use('/address', addressRouter)
router.use('/category', categoryRouter)
router.use('/wishlist', wishlistRouter)
router.use('/seller', sellerRouter)








module.exports = router;
