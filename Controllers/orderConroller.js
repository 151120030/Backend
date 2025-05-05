
const Product = require('../Models/ProductModel');
const Address = require('../Models/addressModel'); // Import Address Model
const OrderSummary = require('../Models/OrderSummaryModel');
const OrderDetail = require('../Models/OrderDetailModel');
const Cart = require('../Models/cartModel');
const mongoose = require('mongoose');

exports.order = {
    // placeOrder: async (req, res) => {
    //     const { userId, products, shippingAddressId, fromCart, paymentMethod, cardType,sellerId } = req.body;
    
    //     try {
    //         // Step 1: Create Order Summary
    //         const orderSummary = new OrderSummary({ userId });
    //         console.log("Order Summary Created:", orderSummary);
    //         await orderSummary.save();
            
    //         const orderId = orderSummary._id;
    
    //         // Step 2: Fetch Product Details
    //         const productIds = products.map(p => p.productId);
    //         const productDetails = await Product.find({ _id: { $in: productIds } });
    
    //         if (productDetails.length === 0) {
    //             return res.status(404).json({ message: "Products not found" });
    //         }
    
    //         // Step 3: Calculate Total Price & Create Product List
    //         let totalPrice = 0;
    //         const productList = products.map(p => {
    //             const productInfo = productDetails.find(product => product._id.toString() === p.productId.toString());
    //             totalPrice += productInfo.price * p.quantity;
    
    //             return {
    //                 productId: productInfo._id,
    //                 name: productInfo.name,
    //                 quantity: p.quantity,
    //                 price: productInfo.price * p.quantity,
    //                 productImage: productInfo.image || null,
    //             };
    //         });
    
    //         // Step 4: Fetch Shipping Address
    //         const shippingAddress = await Address.findById(shippingAddressId);
    
    //         if (!shippingAddress) {
    //             return res.status(404).json({ message: "Shipping address not found" });
    //         }
    
    //         // Step 5: Create Order Detail with Payment Method and Card Type
    //         const orderDetailData = {
    //             orderId,
    //             products: productList,
    //             shippingAddress: shippingAddressId,
    //             totalPrice,
    //             paymentMethod,
    //             orderDate: new Date(),
    //             sellerId:sellerId // ✅ Ensuring order date is stored
    //         };
    
    //         // ✅ If payment method is 'card', add `cardType`
    //         if (paymentMethod.toLowerCase() === "card" || paymentMethod.toLowerCase() === "cards") {
    //             orderDetailData.cardType = cardType || "Unknown"; // Default to 'Unknown' if not provided
    //         }
    
    //         console.log("Saving Order Detail:", orderDetailData); // Debugging log
    //         if (sellerId) {
    //             orderDetailData.sellerId = sellerId;
    //           }
    //         const orderDetail = new OrderDetail(orderDetailData);
    //         await orderDetail.save();
    
    //         // Step 6: If order is from cart, remove from cart
    //         if (fromCart) {
    //             await Cart.deleteMany({ userId });
    //         }
    
    //         return res.status(201).json({
    //             message: "Order placed and confirmed successfully",
    //             orderId,
    //             orderDetail,
    //         });
    
    //     } catch (error) {
    //         console.error("Error placing and confirming order:", error);
    //         return res.status(500).json({
    //             message: "Internal server error",
    //             error,
    //         });
    //     }
    // },
    

    placeOrder: async (req, res) => {
        const { userId, products, shippingAddressId, fromCart, paymentMethod, cardType, sellerId } = req.body;
    
        try {
            // Step 1: Create Order Summary
            const orderSummary = new OrderSummary({ userId });
            // console.log("Order Summary Created:", orderSummary);
            await orderSummary.save();
            
            const orderId = orderSummary._id;
    
            // Step 2: Fetch Product Details
            const productIds = products.map(p => p.productId);
            const productDetails = await Product.find({ _id: { $in: productIds } });
    
            if (productDetails.length === 0) {
                return res.status(404).json({ message: "Products not found" });
            }
    
            // Step 3: Calculate Total Price & Create Product List
            let totalPrice = 0;
            const productList = products.map(p => {
                const productInfo = productDetails.find(product => product._id.toString() === p.productId.toString());
                totalPrice += productInfo.price * p.quantity;
    
                return {
                    productId: productInfo._id,
                    name: productInfo.name,
                    quantity: p.quantity,
                    price: productInfo.price * p.quantity,
                    productImage: productInfo.image || null,
                };
            });
    
            // Step 4: Fetch Shipping Address
            const shippingAddress = await Address.findById(shippingAddressId);
    
            if (!shippingAddress) {
                return res.status(404).json({ message: "Shipping address not found" });
            }
    
            // Step 5: Create Order Detail
            const orderDetailData = {
                orderId,
                products: productList,
                shippingAddress: shippingAddressId,
                totalPrice,
                paymentMethod,
                orderDate: new Date(), // ✅ Ensuring order date is stored
            };
    
            // ✅ Add `sellerId` only if available
            if (sellerId) {
                orderDetailData.sellerId = sellerId;
            }
    
            // ✅ If payment method is 'card', add `cardType`
            if (paymentMethod.toLowerCase() === "card" || paymentMethod.toLowerCase() === "cards") {
                orderDetailData.cardType = cardType || "Unknown"; // Default to 'Unknown' if not provided
            }
    
            // console.log("Saving Order Detail:", orderDetailData); // Debugging log
    
            const orderDetail = new OrderDetail(orderDetailData);
            await orderDetail.save();
    console.log(orderDetail);
    
            // Step 6: If order is from cart, remove from cart
            if (fromCart) {
                await Cart.deleteMany({ userId });
            }
    
            return res.status(201).json({
                message: "Order placed and confirmed successfully",
                orderId,
                orderDetail,
            });
    
        } catch (error) {
            console.error("Error placing and confirming order:", error);
            return res.status(500).json({
                message: "Internal server error",
                error,
            });
        }
    },
    


  getOrders: async (req, res) => {
    const { userId } = req.params;

    try {
      const orderSummaries = await OrderSummary.find({ userId });
      console.log("Fetched Order Summaries:", orderSummaries);
      if (orderSummaries.length === 0) {
        return res.status(404).json({ message: "No orders found for this user" });
      }

      const orderDetails = await OrderDetail.find({
        orderId: { $in: orderSummaries.map(order => order._id) }
      })
        .populate("products.productId")
        .populate({
          path: 'shippingAddress',
          select: 'streetAddress firstName country city postcode'
        }).populate({
          path: 'products.productId', // Ensure we're getting sellerId
          select: 'name image price originalPrice discount description sellerId title'           // Only select the sellerId along with product data
        });

      console.log("Fetched Order Details:", orderDetails);

      if (orderDetails.length === 0) {
        return res.status(404).json({ message: "Order details not found" });
      }

      // Step 3: Return the orders to the client
      return res.status(200).json({ orders: orderDetails });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  },
 
  
  CancelOrder: async (req, res) => {
    const { orderId } = req.params; // Get the orderId from params
    console.log("Received Order ID for cancellation:", orderId);

    try {
        // Find the order by `_id`
        const order = await OrderDetail.findById(orderId);
        // console.log("Fetched Order Detail:", order);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status === "Cancelled") {
            return res.status(400).json({ message: "Order is already cancelled" });
        }

        // Update order status to "Cancelled"
        order.status = "Cancelled";
        await order.save();
        console.log('--------------',order, '----------------------------------')
        
        // ✅ Step 2: Count total orders in the system
        const totalOrdersCount = await OrderDetail.countDocuments({});
        console.log(`Total Orders: ${totalOrdersCount}`);
        
        // ✅ Step 3: If total orders reach 10 or more, delete cancelled orders
        if (totalOrdersCount >= 10) {
            // const deletedOrders = await OrderDetail.deleteMany({ status: "Cancelled" });
            // console.log(`Deleted ${deletedOrders.deletedCount} cancelled orders.`);
        }

        return res.status(200).json({ message: "Order cancelled successfully" });
    } catch (error) {
        // console.error("Error cancelling order:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
},



updateOrderStatus : async (req, res) => {
    const { orderId } = req.params;  // Get orderId from URL
    const { status } = req.body;  // Get new status from request body

    try {
        // ✅ Validate if orderId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        // ✅ Find order by ID and update status
        const updatedOrder = await OrderDetail.findByIdAndUpdate(
            orderId, 
            { status },
            { new: true }  // Return updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({
            message: "Order status updated successfully",
            updatedOrder
        });
    } catch (error) {
        // console.error("Error updating order status:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}



  
};
