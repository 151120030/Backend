const express = require('express');
const router = express.Router();
const { products } = require('../Controllers/ProductConroller');
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + path.extname(file.originalname)); // Unique filename
    }
})
const uploads = multer({ storage: storage })



// router.get('/get', products.get)
router.get('/get', products.getAllProducts)
router.post('/add', uploads.single("image"), products.createProduct)
router.get('/getSellerProduct/:sellerId', products.getSellersProduct)
router.post('/updateProduct/:productId', uploads.single("image"),products.updateProduct)
router.delete('/deleteProduct/:productId', products.deleteProduct)











module.exports = router;