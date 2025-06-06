const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword:{
        type:String,
        required:true
    }
  
})
const userModel = mongoose.model('UserDetails', userSchema);
module.exports = userModel;