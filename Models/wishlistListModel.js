const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetails',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
}, { timestamps: true });

// Prevent duplicate wishlist entries for the same user & product

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;