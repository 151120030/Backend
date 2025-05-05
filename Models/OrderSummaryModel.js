const mongoose = require('mongoose');

// Define the OrderSummary schema
const orderSummarySchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserDetails',  // Reference to the User model
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,  // Automatically set to the current date
  },
});

// Create the OrderSummary model
const OrderSummary = mongoose.model('OrderSummary', orderSummarySchema);

module.exports = OrderSummary;
