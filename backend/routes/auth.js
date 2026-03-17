import express from 'express';
import { register, login, getCurrentUser, logout } from '../controllers/authController.js';
import { verifyToken, verifyCIITEmail } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user with CIIT email
 * @access  Public
 */
router.post('/register', verifyCIITEmail, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return authentication token
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', verifyToken, getCurrentUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', verifyToken, logout);

export default router;
