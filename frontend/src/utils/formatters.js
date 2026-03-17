/**
 * Utility functions for formatting enums
 */

export const conditionMap = {
  'new': 'Brand New',
  'like-new': 'Like New',
  'good': 'Good Condition',
  'fair': 'Fair Condition',
  'poor': 'Poor Condition'
}

export const formatCondition = (condition) => {
  return conditionMap[condition] || condition
}

export const categoryMap = {
  'electronics': 'Electronics',
  'clothing': 'Clothing',
  'books': 'Books',
  'furniture': 'Furniture',
  'sports': 'Sports',
  'toys': 'Toys',
  'household': 'Household',
  'other': 'Other'
}

export const formatCategory = (category) => {
  return categoryMap[category] || category
}

export const getImageUrl = (image, fallback = '') => {
  if (image && image.trim()) {
    return image;
  }
  const text = fallback ? encodeURIComponent(fallback) : 'Product+Image';
  return `https://placehold.co/700x520?text=${text}`;
}

