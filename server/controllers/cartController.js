import { User } from '../models/User.js';
// ...existing code...


export const updateCart = async (req, res) => { 
    try{
        const {userId, cartItems} = req.body;
        await User.findByIdAndUpdate(userId,{cartItems })
         res.json({ success: true, message: "Cart updated successfully" }); 

    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}