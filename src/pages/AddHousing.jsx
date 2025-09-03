import React, { useState } from 'react';
import { addHousingListing } from '../services/firebase.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import toast from 'react-hot-toast';
import { Building, Upload, Plus, X, DollarSign, MapPin, Phone, Mail, User, FileText, Bed, Bath } from 'lucide-react';
import ImageUpload from '../components/ImageUpload.jsx';

export default function AddHousing() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'apartment',
    location: '',
    rent: '',
    deposit: '',
    amenities: [],
    images: [],
    contact: {
      name: '',
      phone: '',
      email: '',
    },
    ownerDetails: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    propertyDetails: {
      bedrooms: '',
      bathrooms: '',
      area: '',
      furnished: false,
    },
    documents: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const availableAmenities = [
    'WiFi', 'Parking', 'Furnished', 'AC', 'Security', 'Elevator', 'Garden', 'Gym', 
    'Swimming Pool', 'Laundry', 'Power Backup', 'Water Supply', 'Balcony', 'Pets Allowed'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addHousingListing({
        ...formData,
        submittedBy: user?.id,
        submitterName: user?.name,
        submitterEmail: user?.email,
        available: true,
        approvedAt: new Date(),
      });
      toast.success('Housing listing submitted successfully!');
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting housing listing:', error);
      toast.error('Failed to submit housing listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAmenity = (amenity) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter(a => a !== amenity)
        : [...formData.amenities, amenity]
    });
  };

  const addImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, '']
    });
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };


  const updateImage = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({
      ...formData,
      images: newImages
    });
  };

  const addDocument = () => {
    setFormData({
      ...formData,
      documents: [...formData.documents, '']
    });
  };

  const removeDocument = (index) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((_, i) => i !== index)
    });
  };

  const updateDocument = (index, value) => {
    const newDocuments = [...formData.documents];
    newDocuments[index] = value;
    setFormData({
      ...formData,
      documents: newDocuments
    });
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Listing Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your property listing has been submitted for review. Our admin team will verify the details and approve your listing within 2-3 business days.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Admin team reviews your listing</li>
              <li>• Document verification</li>
              <li>• Property inspection (if required provide detailed documents)</li>
              <li>• Listing goes live after approval</li>
            </ul>
          </div>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Property</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Add your property to our platform and connect with students looking for accommodation. Fill out the details below for admin review.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Property Information
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2BHK Furnished Apartment near IIT Delhi"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="pg">PG</option>
                  <option value="hostel">Hostel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Area, City"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your property, nearby facilities, and what makes it special..."
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Bed className="w-5 h-5 mr-2" />
            Property Details
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.propertyDetails.bedrooms}
                onChange={(e) => setFormData({
                  ...formData,
                  propertyDetails: { ...formData.propertyDetails, bedrooms: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.propertyDetails.bathrooms}
                onChange={(e) => setFormData({
                  ...formData,
                  propertyDetails: { ...formData.propertyDetails, bathrooms: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Area (sq ft)</label>
              <input
                type="text"
                value={formData.propertyDetails.area}
                onChange={(e) => setFormData({
                  ...formData,
                  propertyDetails: { ...formData.propertyDetails, area: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1200"
              />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="furnished"
                checked={formData.propertyDetails.furnished}
                onChange={(e) => setFormData({
                  ...formData,
                  propertyDetails: { ...formData.propertyDetails, furnished: e.target.checked }
                })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="furnished" className="ml-2 text-sm text-gray-700">Fully Furnished</label>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Pricing
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent (₹) *</label>
              <input
                type="number"
                required
                value={formData.rent}
                onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="25000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Security Deposit (₹) *</label>
              <input
                type="number"
                required
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="50000"
              />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableAmenities.map((amenity) => (
              <label key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Contact Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person *</label>
              <input
                type="text"
                required
                value={formData.contact.name}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, name: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contact person name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  required
                  value={formData.contact.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, phone: e.target.value }
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={formData.contact.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, email: e.target.value }
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contact@email.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Owner Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Owner Details</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name *</label>
              <input
                type="text"
                required
                value={formData.ownerDetails.name}
                onChange={(e) => setFormData({
                  ...formData,
                  ownerDetails: { ...formData.ownerDetails, name: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Property owner name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Owner Email *</label>
              <input
                type="email"
                required
                value={formData.ownerDetails.email}
                onChange={(e) => setFormData({
                  ...formData,
                  ownerDetails: { ...formData.ownerDetails, email: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="owner@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Owner Phone *</label>
              <input
                type="tel"
                required
                value={formData.ownerDetails.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  ownerDetails: { ...formData.ownerDetails, phone: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Owner Address *</label>
              <input
                type="text"
                required
                value={formData.ownerDetails.address}
                onChange={(e) => setFormData({
                  ...formData,
                  ownerDetails: { ...formData.ownerDetails, address: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Owner's address"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Property Images
          </h3>
          <ImageUpload
            images={formData.images}
            onImagesChange={(newImages) => setFormData({ ...formData, images: newImages })}
            multiple={true}
            maxImages={10}
            folder="housing_images"
            label="Upload photos of your property"
          />
          <div className="mt-4 p-4 bg-blue-50 rounded-xl">
            <h4 className="font-medium text-blue-900 mb-2">Recommended Images:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Living room and common areas</li>
              <li>• Bedrooms and bathrooms</li>
              <li>• Kitchen and dining area</li>
              <li>• Building exterior and entrance</li>
              <li>• Nearby amenities and landmarks</li>
            </ul>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Required Documents
          </h3>
          <div className="space-y-4">
            {formData.documents.map((doc, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={doc}
                  onChange={(e) => updateDocument(index, e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Document name or URL"
                />
                <button
                  type="button"
                  onClick={() => removeDocument(index)}
                  className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDocument}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Document
            </button>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-xl">
            <h4 className="font-medium text-blue-900 mb-2">Required Documents:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Property ownership documents</li>
              <li>• Identity proof of owner</li>
              <li>• Property tax receipts</li>
              <li>• NOC from society/builder (if applicable)</li>
              <li>• Recent property photos</li>
            </ul>
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting Listing...
              </>
            ) : (
              <>
                <Building className="w-5 h-5 mr-2" />
                Submit for Review
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 mt-3">
            By submitting, you agree to our terms and conditions for property listings.
          </p>
        </div>
      </form>
    </div>
  );
}