import jwt from "jsonwebtoken";

export const SellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    if (
      password === process.env.SELLER_PASSWORD &&
      email.toLowerCase() === process.env.SELLER_EMAIL.toLowerCase()
    ) {
      const sellerToken = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("sellerToken", sellerToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ success: true, message: "Login successful" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const isSellerAuth = async (req, res) => {
  try {
    return res.json({ success: true, seller: req.seller });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const SellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.status(200).json({ success: true, message: "Seller logged out successfully" });
  } catch (error) {
    console.error("Error logging out seller:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



