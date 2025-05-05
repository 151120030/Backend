const mongoose = require('mongoose');

const categoryMap = {
  'skin-care': ['Cleanser', 'Serums', 'Moisturizers', 'Toners', 'Sunscreens', 'Eye Care', 'Face Mask', 'Scrubs', 'Lip Balm'],
  'bath-body': ['Body Wash', 'Body Lotion', 'Body Scrub', 'Hand Cream', 'Roll Ons'],
  'Makeup': ['Foundation', 'Concealer', 'Blush', 'Highlighter', 'Lipstick', 'LipGloss', 'Eyeliner', 'Mascara', 'Eyeshadow'],
  'fragrance': ['Perfume', 'Body Mist', 'Deodorant'],
  'hair-care': ['Shampoo', 'Conditioner', 'Hair Oil', 'Hair Mask', 'Hair Serum', 'Hair Styling'],
};

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    enum: Object.keys(categoryMap), // Ensures only valid titles can be selected
  },
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
    default: function () {
      return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    },
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return categoryMap[this.title]?.includes(value);
      },
      message: props => `${props.value} is not a valid category for the selected title ${props.instance.title}`,
    },
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0, // Default rating
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: false,
  },
  active: {
    type: Boolean,
    default: true, // Default rating
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
