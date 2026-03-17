import express from 'express';
import {
  getUserProfile,
  getUserListings,
  updateUserProfile,
  getUserRating,
  addUserReview,
  getUserReviews,
  deleteReview
} from '../controllers/userController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile', verifyToken, updateUserProfile);

/**
 * @route   DELETE /api/users/reviews/:reviewId
 * @desc    Delete a review
 * @access  Private
 */
router.delete('/reviews/:reviewId', verifyToken, deleteReview);

/**
 * @route   GET /api/users/:userId
 * @desc    Get user profile by userId
 * @access  Public
 */
router.get('/:userId', getUserProfile);

/**
 * @route   GET /api/users/:userId/listings
 * @desc    Get user's listings
 * @access  Public
 */
router.get('/:userId/listings', getUserListings);

/**
 * @route   GET /api/users/:userId/reviews
 * @desc    Get all reviews for a user
 * @access  Public
 */
router.get('/:userId/reviews', getUserReviews);

/**
 * @route   GET /api/users/:userId/rating
 * @desc    Get user rating/reviews summary
 * @access  Public
 */
router.get('/:userId/rating', getUserRating);

/**
 * @route   POST /api/users/:userId/review
 * @desc    Add review for a user
 * @access  Private
 */
router.post('/:userId/review', verifyToken, addUserReview);

export default router;
