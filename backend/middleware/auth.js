const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
const authHeader = req.headers['authorization'];
  // Extract token after 'Bearer'
  const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : null;
  console.log('🔐 Auth middleware - token received:', token);

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info to request object
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
