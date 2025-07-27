import React, { useState } from 'react';
import { Users, User, MapPin, DollarSign, Calendar, Save } from 'lucide-react';
import { addRoommateProfile } from '../services/firebase.js';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function AddRoommateProfile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    budget: '',
    availableFrom: '',
    preferences: {
      gender: 'any',
      lifestyle: 'moderate',
      cleanliness: 'neat',
      smoking: false,
      pets: false,
    },
    contactInfo: {
      whatsapp: '',
      telegram: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addRoommateProfile({ ...formData, userId: user.id });
      setSubmitted(true);
    } catch (error) {
      alert('Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Created Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your roommate profile is now live and visible to other students looking for roommates. You'll start receiving messages from potential matches soon!
          </p>
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Your profile appears in roommate search results</li>
              <li>• Other students can contact you directly</li>
              <li>• You can browse and contact other roommate profiles</li>
              <li>• Update your profile anytime from your dashboard</li>
            </ul>
          </div>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => window.location.href = '/roommates'}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              Browse Roommates
            </button>
            <button
              onClick={() => window.location.href = '/profile'}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              View My Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Roommate Profile</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create a detailed profile to help other students find you as a potential roommate. Your profile will be visible immediately after creation.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Basic Information
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Looking for a neat and quiet female roommate"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
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
                    placeholder="Near IIT Delhi, Hauz Khas"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget (₹/month) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    required
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="8000"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available From *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  required
                  value={formData.availableFrom}
                  onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                placeholder="Tell potential roommates about yourself, your lifestyle, and what you're looking for in a roommate..."
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Roommate Preferences</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender Preference</label>
              <select
                value={formData.preferences.gender}
                onChange={(e) => setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, gender: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="any">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lifestyle</label>
              <select
                value={formData.preferences.lifestyle}
                onChange={(e) => setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, lifestyle: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="quiet">Quiet</option>
                <option value="moderate">Moderate</option>
                <option value="social">Social</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cleanliness</label>
              <select
                value={formData.preferences.cleanliness}
                onChange={(e) => setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, cleanliness: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="neat">Very Neat</option>
                <option value="average">Average</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="smoking"
                checked={formData.preferences.smoking}
                onChange={(e) => setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, smoking: e.target.checked }
                })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="smoking" className="ml-2 text-sm text-gray-700">Smoking allowed</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pets"
                checked={formData.preferences.pets}
                onChange={(e) => setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, pets: e.target.checked }
                })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="pets" className="ml-2 text-sm text-gray-700">Pets allowed</label>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
              <input
                type="tel"
                value={formData.contactInfo.whatsapp}
                onChange={(e) => setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, whatsapp: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telegram Username</label>
              <input
                type="text"
                value={formData.contactInfo.telegram}
                onChange={(e) => setFormData({
                  ...formData,
                  contactInfo: { ...formData.contactInfo, telegram: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="@username"
              />
            </div>
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
                Creating Profile...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Create Roommate Profile
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 mt-3">
            Your profile will be visible to other students immediately after creation.
          </p>
        </div>
      </form>
    </div>
  );
}