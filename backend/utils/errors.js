/**
 * Error handling utilities for CIIT Marketplace API
 */

export class APIError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
  }
}

/**
 * Validation Error
 */
export class ValidationError extends APIError {
  constructor(message) {
    super(message, 400);
    this.type = 'ValidationError';
  }
}

/**
 * Authentication Error
 */
export class AuthenticationError extends APIError {
  constructor(message = 'Authentication required') {
    super(message, 401);
    this.type = 'AuthenticationError';
  }
}

/**
 * Authorization Error
 */
export class AuthorizationError extends APIError {
  constructor(message = 'Access denied') {
    super(message, 403);
    this.type = 'AuthorizationError';
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends APIError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.type = 'NotFoundError';
  }
}

/**
 * Conflict Error
 */
export class ConflictError extends APIError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
    this.type = 'ConflictError';
  }
}

/**
 * Format error response
 */
export const formatErrorResponse = (error) => {
  if (error instanceof APIError) {
    return {
      success: false,
      message: error.message,
      statusCode: error.statusCode,
      type: error.type
    };
  }

  // Handle Firebase errors
  if (error.code) {
    switch (error.code) {
      case 'auth/email-already-exists':
        return {
          success: false,
          message: 'Email already registered',
          statusCode: 409,
          type: 'ConflictError'
        };
      case 'auth/invalid-email':
        return {
          success: false,
          message: 'Invalid email format',
          statusCode: 400,
          type: 'ValidationError'
        };
      case 'auth/weak-password':
        return {
          success: false,
          message: 'Password is too weak (minimum 6 characters)',
          statusCode: 400,
          type: 'ValidationError'
        };
      case 'auth/user-not-found':
        return {
          success: false,
          message: 'User not found',
          statusCode: 404,
          type: 'NotFoundError'
        };
      default:
        return {
          success: false,
          message: 'Firebase authentication error',
          statusCode: 500,
          type: 'FirebaseError'
        };
    }
  }

  // Generic error
  return {
    success: false,
    message: error.message || 'Internal server error',
    statusCode: 500,
    type: 'UnknownError'
  };
};
