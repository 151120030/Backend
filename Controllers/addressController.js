const AddressModel = require('../Models/addressModel');
const Address = require('../Models/addressModel');

exports.address = {
    addAddress: async (req, res) => {
        try {
            const { userId, firstName, country, streetAddress, postcode, city, phone, isDefault } = req.body;

            // Validate required fields
            if (!userId || !firstName || !country || !streetAddress || !city || !phone) {
                return res.status(400).json({ message: "All required fields must be filled." });
            }

            // If the address is set as default, unset the previous default address
            if (isDefault) {
                await AddressModel.updateMany({ userId }, { isDefault: false });
            }

            // Create a new address
            const newAddress = new AddressModel({
                userId,
                firstName,
                country,
                streetAddress,
                postcode,
                city,
                phone,
                isDefault
            });

            // Save to database
            await newAddress.save();

            res.status(201).json({ message: "Address added successfully!", address: newAddress });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },
    getAddress: async (req, res) => {
        try {
            const { userId } = req.params;
            // console.log(userId);

            if (!userId) {
                return res.status(400).json({ message: "User ID is required." });
            }

            const addresses = await AddressModel.find({ userId });

            if (!addresses.length) {
                return res.status(404).json({ message: "No addresses found for this user." });
            }

            res.status(200).json({ addresses });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },

  
        editAddress: async (req, res) => {
            try {
                const { userId, firstName, country, streetAddress, postcode, city, phone, isDefault, _id } = req.body;

                // Validate required fields
                if (!_id || !userId || !firstName || !country || !streetAddress || !city || !phone) {
                    return res.status(400).json({ message: "All required fields must be filled." });
                }

                // If updating to default, unset other default addresses
                if (isDefault) {
                    await AddressModel.updateMany({ userId }, { isDefault: false });
                }
                console.log('sdfsdfdsf')
                // Find and update the address
                const updatedAddress = await AddressModel.findByIdAndUpdate(
                    _id,
                    { firstName, country, streetAddress, postcode, city, phone, isDefault },
                    { new: true, runValidators: true }
                );

                if (!updatedAddress) {
                    return res.status(404).json({ message: "Address not found." });
                }

                res.status(200).json({ message: "Address updated successfully!", address: updatedAddress });
            } catch (error) {
                res.status(500).json({ message: "Server error", error: error.message });
            }
        }
    };

