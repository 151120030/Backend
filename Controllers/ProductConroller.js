

// const Product = require('../Models/ProductModel');

// const categoryMapping = {
//     'skin-care': ['Cleanser', 'Face Mask', 'Lip Balm', 'Moisturizers', 'Sunscreens', 'Serums', 'Scrubs', 'Toners', 'Eye Care'],
//     'bath-body': ['Body Wash', 'Body Lotion', 'Body Scrub', 'Hand Cream', 'Roll-Ons'],
//     'Makeup': ['Foundation', 'Concealer', 'Blush', 'Highlighter', 'Lipstick', 'LipGloss', 'Eyeliner', 'Mascara', 'Eyeshadow'],
//     'fragrance': ['Perfume', 'Body Mist', 'Deodorant'],
//     'hair-care': ['Shampoo', 'Conditioner', 'Hair Oil', 'Hair Mask', 'Hair Serum', 'Hair Styling']
// };

// exports.products = {
//     // ✅ Get all products
//     getAllProducts: async (req, res) => {
//         try {
//             const products = await Product.find();
//             res.status(200).json({ products });
//         } catch (error) {
//             console.error('Error fetching products:', error);
//             res.status(500).json({ message: 'Internal server error' });
//         }
//     },

//     // ✅ Create a new product
//     createProduct: async (req, res) => {
//         try {
//             const { title, name, price, originalPrice, description, category, sellerId } = req.body;

//             if (!title || !name || !price || !originalPrice || !description || !category || !req.file) {
//                 return res.status(400).json({ message: 'All fields including an image are required' });
//             }

//             // Validate title and category
//             if (!categoryMapping[title] || !categoryMapping[title].includes(category)) {
//                 return res.status(400).json({ message: `Invalid category for ${title}. Allowed: ${categoryMapping[title]?.join(', ')}` });
//             }

//             const newProduct = new Product({
//                 title,
//                 name,
//                 price,
//                 originalPrice,
//                 image: req.file.path, 
//                 description,
//                 category,
//                 sellerId: sellerId || null
//             });

//             const savedProduct = await newProduct.save();
//             res.status(201).json({ message: 'Product created successfully', product: savedProduct });
//         } catch (error) {
//             console.error('Error creating product:', error);
//             res.status(500).json({ message: 'Internal server error' });
//         }
//     },

//     // ✅ Get seller's products
//     getSellersProduct: async (req, res) => {
//         try {
//             const { sellerId } = req.params;
//             const products = await Product.find({ sellerId });

//             if (!products.length) {
//                 return res.status(404).json({ message: 'No products found for this seller' });
//             }

//             res.status(200).json(products);
//         } catch (error) {
//             console.error('Error fetching seller products:', error);
//             res.status(500).json({ message: 'Internal server error' });
//         }
//     },

//     // ✅ Update product
//     updateProduct: async (req, res) => {
//         try {
//             const { productId } = req.params;
//             const { title, name, price, originalPrice, description, category } = req.body;
//             console.log("Received Product ID:", productId);
//             console.log("Request Body:", req.body);
//             console.log("Request File:", req.file); // Log the uploaded file
        
//             let product = await Product.findById(productId);
//             if (!product) {
//                 return res.status(404).json({ message: 'Product not found' });
//             }

//             // Validate category if updated
//             if (category && (!categoryMapping[product.title] || !categoryMapping[product.title].includes(category))) {
//                 return res.status(400).json({ message: `Invalid category for ${product.title}. Allowed: ${categoryMapping[product.title]?.join(', ')}` });
//             }

//             // Update product fields
//             product.title = title || product.title;
//             product.name = name || product.name;
//             product.price = price || product.price;
//             product.originalPrice = originalPrice || product.originalPrice;
//             product.description = description || product.description;
//             if (category) product.category = category;
//             if (req.file) product.image = req.file.path; // Ensure consistency

//             const updatedProduct = await product.save();
//             res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
//         } catch (error) {
//             console.error('Error updating product:', error);
//             res.status(500).json({ message: 'Internal server error' });
//         }
//     },

//     // ✅ Delete product
//     deleteProduct: async (req, res) => {
//         try {
//             const { productId } = req.params;
//             const deletedProduct = await Product.findByIdAndDelete(productId);
//             if (!deletedProduct) {
//                 return res.status(404).json({ message: 'Product not found' });
//             }
//             res.status(200).json({ message: 'Product deleted successfully' });
//         } catch (error) {
//             console.error('Error deleting product:', error);
//             res.status(500).json({ message: 'Internal server error' });
//         }
//     },
// };
const Product = require('../Models/ProductModel');

const categoryMapping = {
    'skin-care': ['Cleanser', 'Face Mask', 'Lip Balm', 'Moisturizers', 'Sunscreens', 'Serums', 'Scrubs', 'Toners', 'Eye Care'],
    'bath-body': ['Body Wash', 'Body Lotion', 'Body Scrub', 'Hand Cream', 'Roll-Ons'],
    'Makeup': ['Foundation', 'Concealer', 'Blush', 'Highlighter', 'Lipstick', 'LipGloss', 'Eyeliner', 'Mascara', 'Eyeshadow'],
    'fragrance': ['Perfume', 'Body Mist', 'Deodorant'],
    'hair-care': ['Shampoo', 'Conditioner', 'Hair Oil', 'Hair Mask', 'Hair Serum', 'Hair Styling']
};

exports.products = {
    // ✅ Get all products
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.find({ active: true});
            res.status(200).json({ products });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // ✅ Create a new product
    createProduct: async (req, res) => {
        try {
            const { title, name, brand, price, originalPrice, description, category, sellerId,rating } = req.body;

            if (!title || !name || !brand || !price || !originalPrice || !description || !category || !rating || !req.file) {
                return res.status(400).json({ message: 'All fields including an image are required' });
            }

            // Validate title and category
            if (!categoryMapping[title] || !categoryMapping[title].includes(category)) {
                return res.status(400).json({ message: `Invalid category for ${title}. Allowed: ${categoryMapping[title]?.join(', ')}` });
            }
            let productRating = parseFloat(rating);
            if (isNaN(productRating) || productRating < 1 || productRating > 5) {
                productRating = 0; // Default if invalid
            }
            const newProduct = new Product({
                title,
                name,
                brand,
                price,
                originalPrice,
                image: req.file.path, 
                description,
                category,
                rating: productRating,     
                           sellerId: sellerId || null
            });

            const savedProduct = await newProduct.save();
            res.status(201).json({ message: 'Product created successfully', product: savedProduct });
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // ✅ Get seller's products
    getSellersProduct: async (req, res) => {
        try {
            const { sellerId } = req.params;
            const products = await Product.find({ sellerId });

            if (!products.length) {
                return res.status(404).json({ message: 'No products found for this seller' });
            }

            res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching seller products:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // ✅ Update product
    updateProduct: async (req, res) => {
        try {
            const { productId } = req.params;
            const { title, name, brand, price, originalPrice, description, category, rating } = req.body;
    
            let product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            // Validate category if updated
            if (category && (!categoryMapping[product.title] || !categoryMapping[product.title].includes(category))) {
                return res.status(400).json({ message: `Invalid category for ${product.title}. Allowed: ${categoryMapping[product.title]?.join(', ')}` });
            }
    
            // Update product fields
            product.title = title || product.title;
            product.name = name || product.name;
            product.brand = brand || product.brand;
            product.price = price || product.price;
            product.originalPrice = originalPrice || product.originalPrice;
            product.description = description || product.description;
            if (category) product.category = category;
            if (req.file) product.image = req.file.path; // Ensure consistency
            
            // **Convert and Update Rating**
            if (rating !== undefined && rating !== "") {
                product.rating = Number(rating); // Convert to number before saving
            }
    
            const updatedProduct = await product.save();
            res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    
    // ✅ Delete product
    deleteProduct: async (req, res) => {
        try {
            const { productId } = req.params;
            
            // Find and update the product's 'active' field instead of deleting
            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                { active: false },  // Set active to false instead of deleting
                { new: true }       // Return the updated product
            );
    console.log(updatedProduct);
    
            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            res.status(200).json({ message: 'Product deactivated successfully', product: updatedProduct });
        } catch (error) {
            console.error('Error deactivating product:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    
};
