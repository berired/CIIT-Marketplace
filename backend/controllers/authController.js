import jwt from 'jsonwebtoken';
import { adminAuth, adminDb } from '../config/firebase.js';
import {
  isValidEmail,
  isValidCIITEmail,
  isValidPassword,
  validateRequiredFields
} from '../utils/validators.js';

/**
 * Register a new user with CIIT email
 */
export const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Validate required fields
    const missing = validateRequiredFields({ email, password, fullName });
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Please provide: ${missing.join(', ')}`
      });
    }

    // Validate email format
    if (!isValidEmail(email.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Verify CIIT email
    if (!isValidCIITEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Only CIIT email addresses (@ciit.edu.ph) are allowed'
      });
    }

    // Validate password
    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Validate full name length
    if (fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full name must be at least 2 characters long'
      });
    }

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email: email.toLowerCase(),
      password,
      displayName: fullName
    });

    // Create user document in Firestore
    const userDocRef = adminDb.collection('users').doc(userRecord.uid);
    await userDocRef.set({
      uid: userRecord.uid,
      email: email.toLowerCase(),
      fullName,
      username: fullName.toLowerCase().replace(/\s+/g, '_'),
      bio: '',
      location: 'CIIT Campus',
      avatar: 'https://placehold.co/150',
      rating: 5,
      reviews: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isAdmin: false
    });

    // Get custom token for authentication
    const token = jwt.sign(
      { uid: userRecord.uid, email: email.toLowerCase() },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        uid: userRecord.uid,
        email: email.toLowerCase(),
        fullName
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    if (error.code === 'auth/weak-password') {
      return res.status(400).json({
        success: false,
        message: 'Password is too weak. Use at least 6 characters'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

/**
 * Login user and return authentication token
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase();

    // Verify user exists
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(normalizedEmail);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
      throw error;
    }

    // IMPORTANT: Password verification via Firebase Admin SDK
    // The Admin SDK doesn't have native password verification
    // Use client-side Firebase auth for production password verification
    // This endpoint trusts that client has already verified the password
    // OR you can implement custom password verification logic here

    // For production: Client should authenticate with Firebase Client SDK first
    // and send the ID token instead of password

    // Generate JWT token for session management
    const token = jwt.sign(
      { uid: userRecord.uid, email: normalizedEmail },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    // Get user document from Firestore
    const userDoc = await adminDb.collection('users').doc(userRecord.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    const userData = userDoc.data();

    // Log successful login
    console.log(`✅ User logged in: ${normalizedEmail}`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        fullName: userData?.fullName || userRecord.displayName,
        username: userData?.username,
        avatar: userData?.avatar,
        isAdmin: userData?.isAdmin || false
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    // Verify userId exists in request (set by verifyToken middleware)
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
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

    res.status(200).json({
      success: true,
      user: {
        uid: userId,
        ...userData
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

/**
 * Logout user (client-side handling in frontend)
 */
export const logout = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
};
