// Cloudinary service for image uploads
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Upload image to Cloudinary
 * @param {File} file - The image file to upload
 * @param {string} folder - Optional folder name to organize uploads
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadImageToCloudinary = async (file, folder = 'student_connector') => {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a valid image file (JPEG, PNG, GIF, WebP)');
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    throw new Error('File size too large. Please upload an image smaller than 10MB');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {FileList|Array} files - Array of image files to upload
 * @param {string} folder - Optional folder name to organize uploads
 * @param {Function} onProgress - Optional callback for upload progress
 * @returns {Promise<Array<string>>} - Array of secure URLs of uploaded images
 */
export const uploadMultipleImages = async (files, folder = 'student_connector', onProgress = null) => {
  const fileArray = Array.from(files);
  const uploadPromises = fileArray.map(async (file, index) => {
    try {
      const url = await uploadImageToCloudinary(file, folder);
      if (onProgress) {
        onProgress(index + 1, fileArray.length);
      }
      return url;
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      throw error;
    }
  });

  return Promise.all(uploadPromises);
};

/**
 * Get optimized image URL from Cloudinary
 * @param {string} publicId - The public ID of the image
 * @param {Object} transformations - Cloudinary transformation options
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (publicId, transformations = {}) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  
  // Default transformations for optimization
  const defaultTransforms = {
    quality: 'auto',
    fetch_format: 'auto',
    ...transformations
  };

  const transformString = Object.entries(defaultTransforms)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');

  return `${baseUrl}/${transformString}/${publicId}`;
};
