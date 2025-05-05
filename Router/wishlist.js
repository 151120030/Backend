const express = require('express');
const router = express.Router();
const { wishlist } = require('../Controllers/wishlistController');

  

router.get('/get/:userId', wishlist.getWishlist)
router.post('/add',wishlist.addToWishlist)
router.delete('/removeItem',wishlist.removeFromWishlist);




module.exports = router;