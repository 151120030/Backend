const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetails', // References the User model
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // References the Product model
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },

});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
