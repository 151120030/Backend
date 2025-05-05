// const Cart = require('../Models/cartModel');

const Wishlist = require("../Models/wishlistListModel");

exports.wishlist = {

    addToWishlist: async (req, res) => {
        try {
            const { userId, productId } = req.body;
            console.log(req.body);
    
            if (!userId || !productId) {
                return res.status(400).json({ message: "Missing userId or productId" });
            }
    
            // Check if the product already exists in the wishlist
            const existingItem = await Wishlist.findOne({ userId, productId });
    
            if (existingItem) {
                return res.status(200).json({ message: "Product is already in your wishlist" });
            }
    
            // If not found, add to wishlist
            const wishlistItem = new Wishlist({ userId, productId });
            await wishlistItem.save();
            res.status(201).json({ message: "Added to wishlist", wishlistItem });
        } catch (error) {
            res.status(500).json({ message: "Server Error", error });
        }
    },
    
    getWishlist: async (req, res) => {

        try {
            const wishlist = await Wishlist.find({ userId: req.params.userId }).populate('productId');
            res.json(wishlist);
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error });
        }
    },

    removeFromWishlist: async (req, res) => {
        const { userId, productId } = req.body;
        try {
            await Wishlist.deleteOne({ userId, productId });
            res.json({ message: 'Removed from wishlist' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error });
        }
    },


};
