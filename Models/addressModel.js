const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserDetails",
        required: true,
    },
    firstName:  { type: String, required: true },
    country: { type: String, required: true },
    streetAddress: { type: String, required: true },
    postcode: { type: Number },
    city: { type: String, required: true },
    phone: { type: Number, required: true },

    // isDefault: { type: Boolean, default: false }, // To mark default address
}, { timestamps: true });

const AddressModel = mongoose.model("Address", AddressSchema);

module.exports = AddressModel;
