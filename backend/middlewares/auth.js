import jwt from 'jsonwebtoken';
import { adminAuth, adminDb } from '../config/firebase.js';

/**
 * Middleware to verify JWT token from request headers
 */
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    req.userId = decodedToken.uid;
    req.userEmail = decodedToken.email;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

/**
 * Middleware to verify CIIT email format
 */
export const verifyCIITEmail = (req, res, next) => {
  const email = req.body.email?.toLowerCase();
  
  if (!email || !email.endsWith('@ciit.edu.ph')) {
    return res.status(400).json({
      success: false,
      message: 'Only CIIT email addresses (@ciit.edu.ph) are allowed'
    });
  }
  
  next();
};

/**
 * Middleware to verify admin role
 */
export const verifyAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userDoc = await adminDb.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = userDoc.data();

    if (!userData?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify admin status',
      error: error.message
    });
  }
};

/**
 * Middleware for error handling
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};
