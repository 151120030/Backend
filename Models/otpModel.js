const mongoose = require('mongoose')
const otpSchema = mongoose.Schema({

    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'UserDetails' 
       },
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },

})
const otpModel = mongoose.model('otps', otpSchema);
module.exports = otpModel;