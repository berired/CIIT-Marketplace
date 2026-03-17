import { adminDb, adminAuth } from '../config/firebase.js';
import {
  isValidEmail,
  isValidBio,
  isValidLength,
  validateRequiredFields
} from '../utils/validators.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

/**
 * Get user profile by userId
 */
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const userDoc = await adminDb.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        uid: userDoc.id,
        ...userDoc.data()
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message
    });
  }
};

/**
 * Get user's listings
 */
export const getUserListings = async (req, res) => {
  try {
    const { userId } = req.params;

    const snapshot = await adminDb
      .collection('listings')
      .where('sellerId', '==', userId)
      .get();

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
      listings
    });
  } catch (error) {
    console.error('Get user listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user listings',
      error: error.message
    });
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { fullName, username, bio, location, avatar } = req.body;

    // Verify user is authenticated
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to update profile'
      });
    }

    const userDoc = await adminDb.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updateData = {
      updatedAt: new Date().toISOString()
    };

    if (fullName) updateData.fullName = fullName;
    if (username) updateData.username = username;
    if (bio) updateData.bio = bio;
    if (location) updateData.location = location;
    if (avatar) updateData.avatar = avatar;

    // Update user in Firestore
    await userDoc.ref.update(updateData);

    // Update Firebase Auth if fullName changed
    if (fullName) {
      try {
        await adminAuth.updateUser(userId, {
          displayName: fullName
        });
      } catch (authError) {
        console.error('Firebase Auth update error:', authError);
      }
    }

    const updatedDoc = await userDoc.ref.get();

    // Log profile update
    console.log(`✅ Profile updated for user: ${updateData.fullName || userDoc.data()?.fullName}`);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        uid: userId,
        ...updatedDoc.data()
      }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

/**
 * Get user rating/reviews
 */
export const getUserRating = async (req, res) => {
  try {
    const { userId } = req.params;

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
      rating: userData?.rating || 5,
      reviews: userData?.reviews || 0
    });
  } catch (error) {
    console.error('Get user rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user rating',
      error: error.message
    });
  }
};

/**
 * Add review for a user
 */
export const addUserReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { userId: targetUserId } = req.params;
    const { rating, review } = req.body;

    // Verify user is authenticated
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to add review'
      });
    }

    if (!targetUserId || !rating || !review) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rating and review'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Prevent self-review
    if (userId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot review yourself'
      });
    }

    // Create review
    const reviewRef = adminDb.collection('reviews').doc();
    await reviewRef.set({
      id: reviewRef.id,
      fromUserId: userId,
      toUserId: targetUserId,
      rating: parseFloat(rating),
      review,
      createdAt: new Date().toISOString()
    });

    // Update user rating
    const targetUserDoc = await adminDb.collection('users').doc(targetUserId).get();
    const userData = targetUserDoc.data();
    const currentRating = userData?.rating || 5;
    const reviewCount = userData?.reviews || 0;

    const newRating = (currentRating * reviewCount + rating) / (reviewCount + 1);

    await targetUserDoc.ref.update({
      rating: Math.round(newRating * 10) / 10,
      reviews: reviewCount + 1
    });

    // Log review submission
    console.log(`✅ Review submitted (${rating}⭐) from user ${userId} to user ${targetUserId}`);

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review: {
        id: reviewRef.id,
        rating,
        review
      }
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: error.message
    });
  }
};

/**
 * Get all reviews for a user
 */
export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user exists
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get reviews for this user
    const reviewsSnapshot = await adminDb
      .collection('reviews')
      .where('toUserId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const reviews = [];
    for (const doc of reviewsSnapshot.docs) {
      const reviewData = doc.data();
      
      // Get reviewer info
      const reviewerDoc = await adminDb.collection('users').doc(reviewData.fromUserId).get();
      const reviewerData = reviewerDoc.data();

      reviews.push({
        id: doc.id,
        ...reviewData,
        reviewer: {
          uid: reviewData.fromUserId,
          fullName: reviewerData?.fullName,
          avatar: reviewerData?.avatar
        }
      });
    }

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
      summary: {
        totalReviews: reviews.length,
        averageRating: userDoc.data()?.rating || 5
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user reviews',
      error: error.message
    });
  }
};

/**
 * Delete a review (only by reviewer or admin)
 */
export const deleteReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { reviewId } = req.params;

    // Verify user is authenticated
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to delete review'
      });
    }

    const reviewDoc = await adminDb.collection('reviews').doc(reviewId).get();

    if (!reviewDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const reviewData = reviewDoc.data();

    // Verify ownership (only reviewer can delete)
    if (reviewData.fromUserId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews'
      });
    }

    const targetUserId = reviewData.toUserId;
    const rating = reviewData.rating;

    // Delete review
    await reviewDoc.ref.delete();

    // Update user rating
    const targetUserDoc = await adminDb.collection('users').doc(targetUserId).get();
    const userData = targetUserDoc.data();
    const currentRating = userData?.rating || 5;
    const reviewCount = userData?.reviews || 0;

    if (reviewCount > 1) {
      // Recalculate rating (subtract current review and recalculate)
      const newRating = ((currentRating * reviewCount) - rating) / (reviewCount - 1);
      await targetUserDoc.ref.update({
        rating: Math.round(newRating * 10) / 10,
        reviews: reviewCount - 1
      });
    } else {
      // Reset to default
      await targetUserDoc.ref.update({
        rating: 5,
        reviews: 0
      });
    }

    // Log review deletion
    console.log(`✅ Review deleted by user ${userId} (was ${rating}⭐ review for user ${targetUserId})`);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};
