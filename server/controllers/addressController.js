import Address from '../models/Address.js';

export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ from auth middleware
    const addressData = req.body; // ✅ now frontend sends raw object

    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing user ID" });
    }

    const newAddress = new Address({
      userId,
      firstName: addressData.firstName,
      lastName: addressData.lastName,
      email: addressData.email,
      street: addressData.street,
      city: addressData.city,
      state: addressData.state,
      zipcode: addressData.zipcode,
      country: addressData.country,
      phone: addressData.phone,
    });

    await newAddress.save();

    res.json({ success: true, message: "Address added successfully", address: newAddress });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const getAddressByUserId = async (req, res) => {
    try {
           const userId = req.user.id;
    
        if (!userId) {
        return res.status(400).json({ success: false, message: "Missing user ID" });
        }
    
        const addresses = await Address.find({ userId });
    
        if (addresses.length === 0) {
        return res.status(404).json({ success: false, message: "No addresses found for this user" });
        }
    
        res.json({ success: true, addresses });
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
    }