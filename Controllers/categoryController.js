// const Cart = require('../Models/cartModel');

const Product = require("../Models/ProductModel");

exports.category = {
   
  getProductsByCategory: async (req, res) => {
    try {
        const { category } = req.query;
        console.log("Searching products in category:", category);

        const products = await Product.find({ category: category, active: true }); // Search by category
        console.log(products);

        if (products.length === 0) {
            return res.json({ success: false, message: "No products found in this category" });
        }

        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
},

    getProductByTitle : async (req, res) => {
      try {
          const { title } = req.query;
  
          if (!title) {
              return res.status(400).json({ message: 'Title is required' });
          }
  
          const products = await Product.find({ title: { $regex: new RegExp(title, "i") } }); // Case-insensitive search
  
          if (products.length === 0) {
              return res.status(404).json({ message: 'No products found with this title' });
          }
  
          res.status(200).json({ success: true, products });
      } catch (error) {
          console.error('Error fetching product by title:', error.message);
          res.status(500).json({ message: 'Server error', error: error.message });
      }
  }

};
