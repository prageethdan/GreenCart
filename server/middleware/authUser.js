import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  try {
    // decode JWT
    const tokendecoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ attach user info to req.user instead of req.body
    req.user = { id: tokendecoded.id };

    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ message: 'Unauthorized access' });
  }
};

export default authUser;
