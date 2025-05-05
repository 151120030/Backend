const express = require('express');
const router = express.Router();
const { address } = require('../Controllers/addressController');

  

router.get('/get/:userId', address.getAddress)
router.post('/add', address.addAddress)
router.post('/update', address.editAddress)





module.exports = router;

