import { User } from '../models/User.js';
// ...existing code...


export const updateCart = async (req, res) => { 
    try {
        const { userId, cartItems } = req.body;
        console.log("Received updateCart request:");
        console.log("userId:", userId);
        console.log("cartItems:", cartItems);

        const user = await User.findByIdAndUpdate(userId, { cartItems }, { new: true });
        if (!user) {
            console.log("User not found for cart update.");
            return res.status(404).json({ success: false, message: "User not found" });
        }

        console.log("Cart updated successfully for user:", userId);
        res.json({ success: true, message: "Cart updated", cartItems: user.cartItems });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}