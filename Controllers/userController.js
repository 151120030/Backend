const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const userModel = require('../Models/userSchema');
const otpModel = require('../Models/otpModel')
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const AddressModel = require('../Models/addressModel');

exports.user = {
    getLoggedinUser: async (req, res) => {
        try {
            const user = await userModel.findById(req.userId);
            if (!user) {
                return res.status(404).json({ isSuccess: false, message: 'User not found' });
            }
            res.json({ isSuccess: true, data: user });
        } catch (err) {
            res.status(500).json({ isSuccess: false, message: err.message });
        }
    },
    register: async (req, res) => {
        try {
            const { email, password, confirmPassword } = req.body;

            // Validate email
            if (!email) {
                return res.status(400).json({
                    isSuccess: false,
                    message: 'A valid email address is required.',
                });
            }
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    isSuccess: false,
                    message: 'Email is already registered. Please log in.',
                });
            }
            // Validate password and confirmPassword
            if (!password || !confirmPassword || password !== confirmPassword) {
                return res.status(400).json({
                    isSuccess: false,
                    message: 'Password and confirmPassword must match and cannot be empty.',
                });
            }

            // Hash the password
            const hash = await bcrypt.hash(String(password), 10);

            // Create user
            const user = await userModel.create({
                email,
                password: hash,
                confirmPassword: hash,

            });

          

            return res.status(201).json({
                isSuccess: true,
                message: 'User registered successfully. Please login.',
            });
        } catch (err) {
            return res.status(500).json({
                isSuccess: false,
                message: err.message,
            });
        }
    },
    login: async (req, res) => {
        const { email, password} = req.body;
        try {
            const user = await userModel.findOne({ email: req.body.email });
            const isMatch = await bcrypt.compare(String(req.body.password), user.password);



            if (isMatch == false) {
                return res.json({
                    isSuccess: false,
                    message: "email or password cannot match!"
                })
            }
            let token = jwt.sign({
                userId: user._id
            }, 'secret');
            return res.json({
                email,
                password,
                isSuccess: true,
                token,
                userId: user._id,

            })

        } catch (err) {
            return res.json({
                isSuccess: false,
                message: err.message
            })
        }
    },
getUserDetail:async (req,res)=>{
    try {
        const userId = req.params.userId;

        // Fetch user details along with their address
     

        const address = await AddressModel.findOne({ userId });

        res.status(200).json({
          
            address: address || "No address found for this user"
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
},
changePassword: async (req, res) => {
    try {
        let { oldPassword, newPassword } = req.body;
        let user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({ isSuccess: false, message: "User not found!" });
        }

        const isMatch = await bcrypt.compare(String(oldPassword), user.password);
        if (!isMatch) {
            return res.status(400).json({ isSuccess: false, message: "Old password does not match!" });
        }

        user.password = await bcrypt.hash(String(newPassword), 10);
        await user.save();

        return res.json({ isSuccess: true, message: "Password has been changed" });

    } catch (error) {
        return res.status(500).json({ isSuccess: false, message: "Server error" });
    }
},

// ✅ Forgot Password (Send OTP)
forgotPassword: async (req, res) => {
    try {
        // ✅ Ensure email is extracted as a string
        const { email } = req.body;  

        if (!email) {
            return res.status(400).json({ isSuccess: false, message: "Email is required!" });
        }

        let user = await userModel.findOne({ email });  // ✅ Now email is a string

        if (!user) {
            return res.json({ isSuccess: false, message: "User not found!" });
        }

        const otp = generateOTP(6);
        sendMail({
            from: 'hiral kumbhani',
            to: email,  // ✅ Use email variable instead of req.body.email
            subject: "One Time Verification Code",
            html: `<h1>Your OTP is: ${otp}</h1><p>Please confirm within 2 minutes.</p>`,
        });

        await otpModel.deleteOne({ email });  // ✅ Use string email
        await otpModel.create({ 
            userId: user._id, 
            email,  // ✅ Store email correctly
            otp 
        });

        return res.json({
            isSuccess: true,
            message: "Verification code sent to your email",
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ isSuccess: false, message: "Server error" });
    }
},



// ✅ Verify OTP
verifyOtp: async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.body.email });

        if (!user) {
            return res.json({ isSuccess: false, message: "User not found!" });
        }

        let validOtp = await otpModel.findOne({ email: req.body.email, otp: req.body.otp });

        if (!validOtp) {
            return res.json({ isSuccess: false, message: "Invalid or expired OTP, please try again!" });
        }

        return res.json({ isSuccess: true, message: "OTP verified successfully!" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ isSuccess: false, message: "Server error" });
    }
},


// ✅ Reset Password
resetPassword: async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.body.email });

        if (!user) {
            return res.json({ isSuccess: false, message: "User not found!" });
        }

        let validOtp = await otpModel.findOne({ userId: user._id, otp: req.body.otp });

        if (!validOtp) {
            return res.json({ isSuccess: false, message: "Invalid OTP!" });
        }

        user.password = await bcrypt.hash(String(req.body.newPassword), 10);
        await user.save();

        return res.json({ isSuccess: true, message: "Password updated successfully!" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ isSuccess: false, message: "Server error" });
    }
},
};

// ✅ Generate OTP
function generateOTP(length) {
const digits = '0123456789';
let otp = '';
for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
}
return otp;
}

// ✅ Send Mail Function
const sendMail = async (data) => {
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hiralkumbhani721@gmail.com',
        pass: 'ruzl znli qxid skgb',
    },
});

const info = await transporter.sendMail(data);
console.log('Email sent: ' + info.response);
};





