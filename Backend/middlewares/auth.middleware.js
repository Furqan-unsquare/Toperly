import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const verifyToken = (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers['authorization'];
    const queryToken = req.query.token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (queryToken) {
      token = queryToken;
    }

    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const isInstructor = (req, res, next) => {
  if (req.user?.role === 'instructor' || req.user?.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Instructor only.' });
};

export const isStudent = (req, res, next) => {
  if (req.user?.role === 'student' || req.user?.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Student only.' });
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Admin only.' });
};
