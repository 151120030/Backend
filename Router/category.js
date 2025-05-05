const express = require('express');
const router = express.Router();
const { category } = require('../Controllers/categoryController');

  

router.get('/getProductsByCategory', category.getProductsByCategory)
router.get('/findByTitle', category.getProductByTitle)

// router.post('/add', address.addAddress)
// router.post('/update', address.editAddress)





module.exports = router;