import apiClient from './api';

/**
 * Users API endpoints
 */
export const userService = {
  // Get user profile
  getUserProfile: (userId) =>
    apiClient.get(`/users/${userId}`),

  // Update user profile
  updateUserProfile: (profileData) =>
    apiClient.put('/users/profile', profileData),

  // Get user's listings
  getUserListings: (userId) =>
    apiClient.get(`/users/${userId}/listings`),

  // Get user rating
  getUserRating: (userId) =>
    apiClient.get(`/users/${userId}/rating`),

  // Add review for user
  addUserReview: (targetUserId, rating, review) =>
    apiClient.post('/users/review', {
      targetUserId,
      rating,
      review
    })
};

export default userService;
