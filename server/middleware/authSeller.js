import jwt from "jsonwebtoken";

const authSeller = (req, res, next) => {
  const { sellerToken } = req.cookies;

  if (!sellerToken) {
    return res.status(401).json({ success: false, message: "Unauthorized access" });
  }

  try {
    const tokendecoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

    // normalize email case for comparison
    if (tokendecoded.email.toLowerCase() === process.env.SELLER_EMAIL.toLowerCase()) {
      req.seller = { email: tokendecoded.email }; // attach seller info
      return next();
    }

    return res.status(401).json({ success: false, message: "Unauthorized access" });
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({ success: false, message: "Unauthorized access" });
  }
};

export default authSeller;
