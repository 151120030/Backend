const mongoose = require('mongoose');

// Define the Order schema
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetails', // References the User model
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Products', // References the Product model
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, // At least one item is required
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Price can't be negative
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: false,
  },
  productImage: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
