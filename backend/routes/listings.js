import express from 'express';
import {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  getFeaturedListings,
  searchListings,
  markListingAsSold,
  getListingsByStatus,
  getUserSoldListings
} from '../controllers/listingController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route   POST /api/listings
 * @desc    Create a new product listing
 * @access  Private
 */
router.post('/', verifyToken, createListing);

/**
 * @route   GET /api/listings/featured
 * @desc    Get featured listings
 * @access  Public
 */
router.get('/featured', getFeaturedListings);

/**
 * @route   GET /api/listings/search
 * @desc    Search listings by query
 * @access  Public
 */
router.get('/search', searchListings);

/**
 * @route   GET /api/listings
 * @desc    Get all listings with optional filters and sorting
 * @access  Public
 */
router.get('/', getAllListings);

/**
 * @route   GET /api/listings/user/:userId/status
 * @desc    Get user listings by status
 * @access  Public
 */
router.get('/user/:userId/status', getListingsByStatus);

/**
 * @route   GET /api/listings/user/:userId/sold
 * @desc    Get user's sold listings
 * @access  Public
 */
router.get('/user/:userId/sold', getUserSoldListings);

/**
 * @route   GET /api/listings/:id
 * @desc    Get a single listing by ID
 * @access  Public
 */
router.get('/:id', getListingById);

/**
 * @route   PUT /api/listings/:id/status
 * @desc    Mark listing as sold or change status
 * @access  Private
 */
router.put('/:id/status', verifyToken, markListingAsSold);

/**
 * @route   PUT /api/listings/:id
 * @desc    Update a listing
 * @access  Private
 */
router.put('/:id', verifyToken, updateListing);

/**
 * @route   DELETE /api/listings/:id
 * @desc    Delete a listing
 * @access  Private
 */
router.delete('/:id', verifyToken, deleteListing);

export default router;
