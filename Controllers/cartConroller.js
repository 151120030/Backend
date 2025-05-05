const Cart = require('../Models/cartModel');

exports.cart = {
    getProduct: async (req, res) => {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        try {
            const cartItems = await Cart.find({ userId }).populate('productId'); // Populate product details

            if (!cartItems.length) {
                return res.status(404).json({ message: 'Cart is empty' });
            }

            res.status(200).json({ cartItems });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching cart items', error: error.message });
        }
    },
    addToCart: async (req, res) => {
        const { userId, productId, quantity } = req.body;
console.log(req.body);

        if (!userId || !productId) {
            return res.status(400).json({ message: 'User ID and Product ID are required' });
        }

        try {
            let cartItem = await Cart.findOne({ userId, productId });

            if (cartItem) {
                // If product already exists in cart, update quantity
                cartItem.quantity += quantity || 1;
                await cartItem.save();
            } else {
                cartItem = new Cart({ userId, productId, quantity: quantity || 1 });
                await cartItem.save();
            }

            res.status(200).json({ message: 'Added to cart', cartItem });
        } catch (error) {
            res.status(500).json({ message: 'Error adding to cart', error: error.message });
        }
    },
    // Add updateCartItemQuantity functionality
    updateQuantity: async (req, res) => {
        const { cartId, quantity } = req.body;
    
        if (!cartId || quantity === undefined) {
            return res.status(400).json({ message: 'Cart ID and quantity are required' });
        }
    
        console.log("Received cartId:", cartId);
        console.log("Received quantity:", quantity);
    
        try {
            // Find the cart item by cartId
            let cartItem = await Cart.findById(cartId);
    
            if (!cartItem) {
                return res.status(404).json({ message: 'Cart item not found' });
            }
    
            // Update the quantity
            cartItem.quantity = quantity;
            await cartItem.save();
    
            res.status(200).json({ message: 'Cart item quantity updated', cartItem });
        } catch (error) {
            res.status(500).json({ message: 'Error updating cart item quantity', error: error.message });
        }
    },
    
    
    
    
    // Remove cart item functionality
    removeCartItem: async (req, res) => {
        const { userId, productId } = req.body; // Expecting userId and productId in the body
    
        if (!userId || !productId) {
            return res.status(400).json({ message: 'User ID and Product ID are required' });
        }
    
        try {
            // Find and delete the cart item using deleteOne
            const result = await Cart.deleteOne({ userId, productId });
    
            // Check if the item was found and deleted
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Cart item not found' });
            }
    
            res.status(200).json({ message: 'Cart item removed successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error removing cart item', error: error.message });
        }
    },
    


};
