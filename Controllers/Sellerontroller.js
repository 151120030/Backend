const Seller = require("../Models/sellerModel");
const bcrypt = require('bcrypt'); // Import bcrypt
const jwt = require('jsonwebtoken');
const Product = require("../Models/ProductModel");
const Order = require("../Models/OrderModel"); // Ensure Order model is imported
const OrderDetail = require("../Models/OrderDetailModel");
const { default: mongoose } = require("mongoose");

exports.seller = {

    sellerRegister: async (req, res) => {
        try {
            const { email, password, confirmPassword, businessName, phoneNumber} = req.body;

            // Step 1: Validate input data
            if (!email || !password || !confirmPassword || !businessName || !phoneNumber ) {
                return res.status(400).json({
                    isSuccess: false,
                    message: 'All fields are required.',
                });
            }

            // Step 2: Check if seller already exists
            const existingSeller = await Seller.findOne({ email });
            if (existingSeller) {
                return res.status(400).json({
                    isSuccess: false,
                    message: 'Email is already registered with another seller.',
                });
            }

            // Step 3: Validate password and confirmPassword
            if (password !== confirmPassword) {
                return res.status(400).json({
                    isSuccess: false,
                    message: 'Password and confirmPassword must match.',
                });
            }

            // Step 4: Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Step 5: Create the new seller
            const newSeller = new Seller({
                email,
                password: hashedPassword,
                confirmPassword: hashedPassword,
                businessName,
                phoneNumber,
               
            });

            // Step 6: Save the seller to the database
            await newSeller.save();

            // Step 7: Send success response
            return res.status(201).json({
                isSuccess: true,
                message: 'Seller registered successfully. Please log in.',
            });

        } catch (err) {
            console.error('Error registering seller:', err.message);
            return res.status(500).json({
                isSuccess: false,
                message: 'Server error, please try again later.',
            });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            // Check if the seller exists in the database
            const seller = await Seller.findOne({ email });
            if (!seller) {
                return res.status(404).json({
                    isSuccess: false,
                    message: "Seller not found. Please check your email or register."
                });
            }

            // Compare the provided password with the hashed password in the database
            const isMatch = await bcrypt.compare(password, seller.password);
            if (!isMatch) {
                return res.status(400).json({
                    isSuccess: false,
                    message: "Invalid credentials. Please try again."
                });
            }

            // Generate a JWT token if credentials match
           let token = jwt.sign({
            sellerId: seller._id,
                       }, 'secret');
            // Send the token and seller information in the response
            res.json({
                isSuccess: true,
                message: "Login successful",
                token,
                sellerId: seller._id,
                businessName: seller.businessName, // Add other details if needed
            });
        } catch (err) {
            console.error('Error during login:', err);
            res.status(500).json({
                isSuccess: false,
                message: 'Server error. Please try again later.',
            });
        }

    },

    getSellerDetails: async (req, res) => {
        try {
            const { sellerId } = req.params;
            const seller = await Seller.findById(sellerId).select("-password -confirmPassword");
    
            if (!seller) {
                return res.status(404).json({ isSuccess: false, message: "Seller not found" });
            }
    
            res.status(200).json({ isSuccess: true, seller });
        } catch (error) {
            console.error("Error fetching seller details:", error);
            res.status(500).json({ isSuccess: false, message: "Server error", error: error.message });
        }
    },
    getAllSellers: async (req, res) => {
        try {
            const sellers = await Seller.find().select("-password -confirmPassword"); // Exclude passwords
        
            if (!sellers.length) {
                return res.status(404).json({ isSuccess: false, message: "No sellers found" });
            }
    
            res.status(200).json({ isSuccess: true, sellers });
    
        } catch (error) {
            console.error("Error fetching all sellers:", error);
            res.status(500).json({ isSuccess: false, message: "Server error", error: error.message });
        }
    },
    
    dashboardData: async (req, res) => {
        try {
            const { sellerId } = req.params;
            console.log("Seller ID Received:", sellerId);
    
            // Validate seller existence
            const seller = await Seller.findById(sellerId);
            if (!seller) {
                return res.status(404).json({ message: "Seller not found" });
            }
    
            // Fetch total orders where at least one product belongs to the seller
            const totalOrders = await OrderDetail.countDocuments({ sellerId });
            console.log("Total Orders Found:", totalOrders);
    
            // Fetch total products for the seller
            const totalProducts = await Product.countDocuments({ sellerId });
    
            // Fetch total sellers from Seller model
            const totalSellers = await Seller.countDocuments();
    
            // Fetch recent orders (latest 5) where the seller's product is included
            const recentOrders = await OrderDetail.find({ sellerId })
            .sort({ orderDate: -1 })
            .limit(5)
            .populate("orderId") // Fetch order summary details
            .populate("products.productId") // Fetch product details
            .populate("shippingAddress"); // Fetch customer shipping address

        console.log("Recent Orders Found:", recentOrders);
    
            // Return structured dashboard data
            res.status(200).json({
                metrics: {
                    totalOrders,
                    totalProducts,
                    totalSellers,
                },
                recentOrders: recentOrders.map(order => ({
                    productName: order.products[0]?.productId?.name || "N/A",
                    customerName: order.shippingAddress?.firstName || "N/A",
                    amount: order.totalPrice || 0,
                    status: order.status || "Pending",
                })),
            });
    
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
    getOrdersForSeller: async (req, res) => {
        try {
            const { sellerId } = req.params;
            console.log("Fetching orders for Seller ID:", sellerId);
    
            // Validate if seller exists
            const seller = await Seller.findById(sellerId);
            if (!seller) {
                return res.status(404).json({ message: "Seller not found" });
            }
    
            // Find all order details related to this seller
            const sellerOrders = await OrderDetail.find({ sellerId })
                .sort({ createdAt: -1 }) // Sort by latest orders
                .populate("orderId") // Populate order details
                .populate("products.productId") // Populate product details
                .populate("shippingAddress"); // Populate customer shipping details
    
            console.log("Orders found:", sellerOrders.length);
    
            // Format response
            const orders = sellerOrders.map(order => ({
                orderId: order.orderId?._id || "N/A",
                productName: order.products[0]?.productId?.name || "N/A",
                quantity: order.products[0]?.quantity || 1,
                price: order.products[0]?.productId?.price || 0,
                customerName: order.shippingAddress?.firstName || "N/A",
                totalAmount: order.totalPrice || 0,
                status: order.status || "Pending",
                orderDate: order.orderDate || null,
            }));
    console.log(orders);
    
            res.status(200).json({ isSuccess: true, orders });
    
        } catch (error) {
            console.error('Error fetching seller orders:', error);
            res.status(500).json({ isSuccess: false, message: 'Server error', error: error.message });
        }
    }
    
    
}