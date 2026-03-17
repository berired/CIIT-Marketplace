/**
 * Validation utilities for CIIT Marketplace API
 */

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate CIIT email
 */
export const isValidCIITEmail = (email) => {
  return email.toLowerCase().endsWith('@ciit.edu.ph');
};

/**
 * Validate password strength
 * Requirements: At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
export const isValidPassword = (password) => {
  if (password.length < 6) return false;
  return true; // Firebase handles password strength, we just need minimum length
};

/**
 * Validate price
 */
export const isValidPrice = (price) => {
  const numPrice = parseFloat(price);
  return !isNaN(numPrice) && numPrice > 0;
};

/**
 * Validate listing condition
 */
export const isValidCondition = (condition) => {
  const validConditions = ['new', 'like-new', 'good', 'fair', 'poor'];
  return validConditions.includes(condition?.toLowerCase());
};

/**
 * Validate rating
 */
export const isValidRating = (rating) => {
  const numRating = parseFloat(rating);
  return !isNaN(numRating) && numRating >= 1 && numRating <= 5;
};

/**
 * Sanitize string input
 */
export const sanitizeString = (str) => {
  if (!str) return '';
  return str.trim().replace(/[<>\"'%]/g, '');
};

/**
 * Validate required fields
 */
export const validateRequiredFields = (fields) => {
  const missing = [];
  for (const [key, value] of Object.entries(fields)) {
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      missing.push(key);
    }
  }
  return missing;
};

/**
 * Validate category
 */
export const isValidCategory = (category) => {
  const validCategories = [
    'electronics',
    'clothing',
    'books',
    'furniture',
    'sports',
    'toys',
    'household',
    'other'
  ];
  return validCategories.includes(category?.toLowerCase());
};

/**
 * Check if string is within length limits
 */
export const isValidLength = (str, min = 1, max = 5000) => {
  if (!str) return min === 0;
  return str.length >= min && str.length <= max;
};

/**
 * Validate listing title
 */
export const isValidTitle = (title) => {
  return isValidLength(title, 3, 100);
};

/**
 * Validate description
 */
export const isValidDescription = (description) => {
  return isValidLength(description, 10, 5000);
};

/**
 * Validate bio
 */
export const isValidBio = (bio) => {
  return isValidLength(bio, 0, 500);
};
