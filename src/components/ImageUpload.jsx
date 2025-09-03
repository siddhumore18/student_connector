import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import { uploadImageToCloudinary, uploadMultipleImages } from '../services/cloudinary.js';
import toast from 'react-hot-toast';

export default function ImageUpload({ 
  images = [], 
  onImagesChange, 
  multiple = true, 
  maxImages = 5,
  folder = 'student_connector',
  label = 'Upload Images'
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    try {
      if (multiple) {
        const urls = await uploadMultipleImages(
          files, 
          folder, 
          (current, total) => setUploadProgress({ current, total })
        );
        onImagesChange([...images, ...urls]);
        toast.success(`${urls.length} image(s) uploaded successfully!`);
      } else {
        const url = await uploadImageToCloudinary(files[0], folder);
        onImagesChange([url]);
        toast.success('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      setUploadProgress({ current: 0, total: 0 });
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <span className="text-xs text-gray-500">
          {images.length}/{maxImages} images
        </span>
      </div>

      {/* Upload Button */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading || images.length >= maxImages}
        />
        
        {uploading ? (
          <div className="space-y-3">
            <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
            <p className="text-sm text-gray-600">
              Uploading {uploadProgress.current}/{uploadProgress.total} images...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
            <div>
              <button
                type="button"
                onClick={handleUploadClick}
                disabled={images.length >= maxImages}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                {images.length >= maxImages ? 'Maximum reached' : 'Choose Images'}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB each
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEyQzIxIDEzLjEgMjAuMSAxNCAyMCAxNEg0QzIuOSAxNCAyIDEzLjEgMiAxMlYxMEMyIDguOSAyLjkgOCA0IDhIMjBDMjAuMSA4IDIxIDguOSAyMSAxMFYxMloiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTkgMTFDOS41NSAxMSAxMCAxMC41NSAxMCAxMEM5IDkuNDUgOC41NSA5IDggOUM3LjQ1IDkgNyA5LjQ1IDcgMTBDNyAxMC41NSA3LjQ1IDExIDggMTFaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xNyAxMUwxNS41IDEyLjVMMTMgMTBMMTEgMTJIMTdaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                }}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
