const mongoose = require('mongoose');

// Define the OrderDetail schema
const orderDetailSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderSummary',  // Reference to the OrderSummary model
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',  // Reference to the Product model
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,  // At least 1 item required
      },
      price: {
        type: Number,
        required: true,
        min: 0,  // Price can't be negative
      },
      productImage: {
        type: String,
        required: false,  // Optional product image
      },
    },
  ],
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',  // Reference to the Address model
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,  // Total price can't be negative
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled','Out for Delivery','In Progress'],
    default: 'Pending',  // Default status
  },
  orderDate: {
    type: Date,
    default: Date.now,  // Automatically set to the current date
  },
  sellerId: {  
    type: mongoose.Schema.Types.ObjectId,  
    ref: "Seller",  
  },
  paymentMethod: { type: String, required: true },
  cardType: { type: String },
});

// Create the OrderDetail model
const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema);

module.exports = OrderDetail;
