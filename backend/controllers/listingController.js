import { adminDb } from '../config/firebase.js';
import {
  isValidTitle,
  isValidDescription,
  isValidPrice,
  isValidCondition,
  isValidCategory,
  validateRequiredFields
} from '../utils/validators.js';

/**
 * Create a new product listing
 */
export const createListing = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Verify user is authenticated
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to create listing'
      });
    }

    const { title, price, category, condition, description, image } = req.body;

    // Validate required fields
    const missing = validateRequiredFields({ title, price, category, condition, description });
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`
      });
    }

    // Validate title
    if (!isValidTitle(title)) {
      return res.status(400).json({
        success: false,
        message: 'Title must be between 3 and 100 characters'
      });
    }

    // Validate price
    if (!isValidPrice(price)) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }

    // Validate category
    if (!isValidCategory(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Valid options: electronics, clothing, books, furniture, sports, toys, household, other'
      });
    }

    // Validate condition
    if (!isValidCondition(condition)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid condition. Valid options: new, like-new, good, fair, poor'
      });
    }

    // Validate description
    if (!isValidDescription(description)) {
      return res.status(400).json({
        success: false,
        message: 'Description must be between 10 and 5000 characters'
      });
    }

    // Get user info for seller details
    const userDoc = await adminDb.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    const userData = userDoc.data();

    // Create listing
    const listingRef = adminDb.collection('listings').doc();
    await listingRef.set({
      id: listingRef.id,
      title,
      price: parseFloat(price),
      category: category.toLowerCase(),
      condition: condition.toLowerCase(),
      description,
      image: image || 'https://placehold.co/700x520?text=' + encodeURIComponent(title),
      seller: userData?.fullName || 'Unknown Seller',
      sellerId: userId,
      sellerEmail: userData?.email,
      sellerAvatar: userData?.avatar,
      datePosted: new Date().toISOString(),
      location: userData?.location || 'CIIT Campus',
      status: 'active',
      views: 0,
      interested: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Log listing creation
    console.log(`✅ Listing created by ${userData?.fullName}: "${title}" (ID: ${listingRef.id})`);

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing: {
        id: listingRef.id,
        title,
        price,
        category,
        condition,
        description,
        seller: userData?.fullName
      }
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create listing',
      error: error.message
    });
  }
};

/**
 * Get all listings with optional filters
 */
export const getAllListings = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sortBy } = req.query;

    let query = adminDb.collection('listings').where('status', '==', 'active');

    // Apply filters
    if (category && category !== 'All') {
      query = query.where('category', '==', category);
    }

    // Get documents
    let snapshot = await query.get();
    let listings = [];

    snapshot.forEach(doc => {
      listings.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Apply price filter (client-side since Firestore doesn't support range queries easily)
    if (minPrice || maxPrice) {
      listings = listings.filter(item => {
        const price = item.price;
        if (minPrice && price < parseFloat(minPrice)) return false;
        if (maxPrice && price > parseFloat(maxPrice)) return false;
        return true;
      });
    }

    // Apply sorting
    if (sortBy === 'lowest-price') {
      listings.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'highest-price') {
      listings.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      listings.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
    } else if (sortBy === 'a-z') {
      listings.sort((a, b) => a.title.localeCompare(b.title));
    }

    res.status(200).json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listings',
      error: error.message
    });
  }
};

/**
 * Get a single listing by ID
 */
export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listingDoc = await adminDb.collection('listings').doc(id).get();

    if (!listingDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    const listing = listingDoc.data();

    // Increment view count
    await listingDoc.ref.update({
      views: (listing.views || 0) + 1
    });

    res.status(200).json({
      success: true,
      listing: {
        id: listingDoc.id,
        ...listing
      }
    });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listing',
      error: error.message
    });
  }
};

/**
 * Update a listing
 */
export const updateListing = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const updateData = req.body;

    const listingDoc = await adminDb.collection('listings').doc(id).get();

    if (!listingDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    const listing = listingDoc.data();

    // Verify ownership
    if (listing.sellerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own listings'
      });
    }

    // Update listing
    await listingDoc.ref.update({
      ...updateData,
      updatedAt: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      listing: {
        id: listingDoc.id,
        ...listing,
        ...updateData
      }
    });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update listing',
      error: error.message
    });
  }
};

/**
 * Delete a listing
 */
export const deleteListing = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const listingDoc = await adminDb.collection('listings').doc(id).get();

    if (!listingDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    const listing = listingDoc.data();

    // Verify ownership
    if (listing.sellerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own listings'
      });
    }

    // Delete listing
    await listingDoc.ref.delete();

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete listing',
      error: error.message
    });
  }
};

/**
 * Get featured listings
 */
export const getFeaturedListings = async (req, res) => {
  try {
    const query = adminDb
      .collection('listings')
      .orderBy('datePosted', 'desc')
      .limit(8);

    const snapshot = await query.get();
    const listings = [];

    snapshot.forEach(doc => {
      listings.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (error) {
    console.error('Get featured listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured listings',
      error: error.message
    });
  }
};

/**
 * Search listings
 */
export const searchListings = async (req, res) => {
  try {
    const { query: searchQuery } = req.query;

    if (!searchQuery || searchQuery.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    const snapshot = await adminDb
      .collection('listings')
      .where('status', '==', 'active')
      .get();

    const searchTerm = searchQuery.toLowerCase();
    const results = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      if (
        data.title.toLowerCase().includes(searchTerm) ||
        data.description.toLowerCase().includes(searchTerm) ||
        data.category.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: doc.id,
          ...data
        });
      }
    });

    res.status(200).json({
      success: true,
      count: results.length,
      listings: results
    });
  } catch (error) {
    console.error('Search listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search listings',
      error: error.message
    });
  }
};

/**
 * Mark listing as sold or unavailable
 */
export const markListingAsSold = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { status = 'sold' } = req.body;

    const validStatuses = ['active', 'sold', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid options: active, sold, archived'
      });
    }

    const listingDoc = await adminDb.collection('listings').doc(id).get();

    if (!listingDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    const listing = listingDoc.data();

    // Verify ownership
    if (listing.sellerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only modify your own listings'
      });
    }

    // Update listing status
    await listingDoc.ref.update({
      status,
      updatedAt: new Date().toISOString(),
      ...(status === 'sold' && { soldAt: new Date().toISOString() })
    });

    res.status(200).json({
      success: true,
      message: `Listing marked as ${status}`,
      listing: {
        id: listingDoc.id,
        status
      }
    });
  } catch (error) {
    console.error('Mark listing as sold error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update listing status',
      error: error.message
    });
  }
};

/**
 * Get listings by status
 */
export const getListingsByStatus = async (req, res) => {
  try {
    const { status = 'active' } = req.query;
    const { userId } = req.params;

    const validStatuses = ['active', 'sold', 'archived', 'all'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status filter'
      });
    }

    let query = adminDb
      .collection('listings')
      .where('sellerId', '==', userId);

    if (status !== 'all') {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    const listings = [];

    snapshot.forEach(doc => {
      listings.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Sort by datePosted in descending order (most recent first)
    listings.sort((a, b) => {
      const dateA = a.datePosted ? new Date(a.datePosted).getTime() : 0;
      const dateB = b.datePosted ? new Date(b.datePosted).getTime() : 0;
      return dateB - dateA;
    });

    res.status(200).json({
      success: true,
      count: listings.length,
      status,
      listings
    });
  } catch (error) {
    console.error('Get listings by status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listings',
      error: error.message
    });
  }
};

/**
 * Get user's sold listings
 */
export const getUserSoldListings = async (req, res) => {
  try {
    const { userId } = req.params;

    const snapshot = await adminDb
      .collection('listings')
      .where('sellerId', '==', userId)
      .where('status', '==', 'sold')
      .get();

    const listings = [];

    snapshot.forEach(doc => {
      listings.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Sort by soldAt in descending order (most recent first)
    listings.sort((a, b) => {
      const dateA = a.soldAt ? new Date(a.soldAt).getTime() : 0;
      const dateB = b.soldAt ? new Date(b.soldAt).getTime() : 0;
      return dateB - dateA;
    });

    res.status(200).json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (error) {
    console.error('Get sold listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sold listings',
      error: error.message
    });
  }
};
