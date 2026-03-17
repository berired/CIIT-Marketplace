import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration (from environment variables)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get storage reference
const storage = getStorage(app);

/**
 * Upload image to Firebase Storage
 * @param {File} file - Image file to upload
 * @param {string} listingId - Unique identifier for the listing
 * @returns {Promise<string>} - Download URL of uploaded image
 */
export const uploadListingImage = async (file, listingId) => {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const filename = `listings/${listingId}-${timestamp}_${file.name}`;
    
    // Create reference
    const storageRef = ref(storage, filename);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    console.log(`✅ Image uploaded: ${filename}`);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error('Failed to upload image: ' + error.message);
  }
};

/**
 * Upload profile picture to Firebase Storage
 * @param {File} file - Image file to upload
 * @param {string} userId - Unique identifier for the user
 * @returns {Promise<string>} - Download URL of uploaded image
 */
export const uploadProfileImage = async (file, userId) => {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const filename = `profiles/${userId}-${timestamp}_${file.name}`;
    
    // Create reference
    const storageRef = ref(storage, filename);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    console.log(`✅ Profile image uploaded: ${filename}`);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Profile image upload error:', error);
    throw new Error('Failed to upload profile image: ' + error.message);
  }
};

export { storage };
