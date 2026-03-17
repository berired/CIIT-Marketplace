import apiClient from './api';

/**
 * Listings API endpoints
 */
export const listingService = {
  // Get all listings with optional filters and sorting
  getAllListings: (category, minPrice, maxPrice, sortBy) =>
    apiClient.get('/listings', {
      params: { category, minPrice, maxPrice, sortBy }
    }),

  // Get featured listings
  getFeaturedListings: () =>
    apiClient.get('/listings/featured'),

  // Get single listing by ID
  getListingById: (id) =>
    apiClient.get(`/listings/${id}`),

  // Create new listing
  createListing: (listingData) =>
    apiClient.post('/listings', listingData),

  // Update listing
  updateListing: (id, updateData) =>
    apiClient.put(`/listings/${id}`, updateData),

  // Delete listing
  deleteListing: (id) =>
    apiClient.delete(`/listings/${id}`),

  // Search listings
  searchListings: (query) =>
    apiClient.get('/listings/search', {
      params: { query }
    })
};

export default listingService;
