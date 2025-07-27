import React, { useState, useEffect } from 'react';
import { User, Camera, Edit3, Save, X, MapPin, GraduationCap, Phone, Mail, Calendar } from 'lucide-react';
import { getAuth } from "firebase/auth";

const mockProfile = {
  id: '1',
  userId: 'user1',
  name: 'Priya Sharma',
  email: 'priya.sharma@email.com',
  phone: '+91 98765 43210',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
  bio: 'Final year Computer Science student looking for like-minded roommates. I enjoy reading, coding, and exploring new places.',
  course: 'B.Tech Computer Science',
  year: '4th Year',
  college: 'IIT Delhi',
  preferences: {
    gender: 'female',
    budget: { min: 8000, max: 15000 },
    lifestyle: 'moderate',
    cleanliness: 'neat',
    smoking: false,
    pets: false,
  },
  verified: true,
  createdAt: '2024-01-01',
};

export default function Profile() {
  const [profile, setProfile] = useState(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const [showInitialForm, setShowInitialForm] = useState(false);

  // Fetch user info from login (Firebase Auth example)
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const updatedProfile = {
        ...mockProfile,
        name: user.displayName || "",
        email: user.email || "",
        avatar: user.photoURL || mockProfile.avatar,
        userId: user.uid,
      };
      setProfile(updatedProfile);
      setEditForm(updatedProfile);
      if (
        !updatedProfile.phone ||
        !updatedProfile.course ||
        !updatedProfile.year ||
        !updatedProfile.college ||
        !updatedProfile.bio
      ) {
        setShowInitialForm(true);
      }
    }
  }, []);

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setProfile(editForm);
    setShowInitialForm(false);
  };

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  if (showInitialForm) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>
        <form onSubmit={handleInitialSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Phone"
            value={editForm.phone}
            onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Course"
            value={editForm.course}
            onChange={e => setEditForm({ ...editForm, course: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <select
            value={editForm.year}
            onChange={e => setEditForm({ ...editForm, year: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="Graduate">Graduate</option>
          </select>
          <input
            type="text"
            placeholder="College"
            value={editForm.college}
            onChange={e => setEditForm({ ...editForm, college: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <textarea
            placeholder="Bio"
            value={editForm.bio}
            onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <h3 className="font-semibold mt-4">Roommate Preferences</h3>
          <select
            value={editForm.preferences.gender}
            onChange={e => setEditForm({
              ...editForm,
              preferences: { ...editForm.preferences, gender: e.target.value }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Gender Preference</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="any">Any</option>
          </select>
          <select
            value={editForm.preferences.lifestyle}
            onChange={e => setEditForm({
              ...editForm,
              preferences: { ...editForm.preferences, lifestyle: e.target.value }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Lifestyle</option>
            <option value="quiet">Quiet</option>
            <option value="moderate">Moderate</option>
            <option value="social">Social</option>
          </select>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Budget Min"
              value={editForm.preferences.budget.min}
              onChange={e => setEditForm({
                ...editForm,
                preferences: {
                  ...editForm.preferences,
                  budget: { ...editForm.preferences.budget, min: parseInt(e.target.value) }
                }
              })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Budget Max"
              value={editForm.preferences.budget.max}
              onChange={e => setEditForm({
                ...editForm,
                preferences: {
                  ...editForm.preferences,
                  budget: { ...editForm.preferences.budget, max: parseInt(e.target.value) }
                }
              })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <select
            value={editForm.preferences.cleanliness}
            onChange={e => setEditForm({
              ...editForm,
              preferences: { ...editForm.preferences, cleanliness: e.target.value }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Cleanliness</option>
            <option value="neat">Very Neat</option>
            <option value="average">Average</option>
            <option value="flexible">Flexible</option>
          </select>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={editForm.preferences.smoking}
              onChange={e => setEditForm({
                ...editForm,
                preferences: { ...editForm.preferences, smoking: e.target.checked }
              })}
              className="mr-2"
            />
            <label>Smoking allowed</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={editForm.preferences.pets}
              onChange={e => setEditForm({
                ...editForm,
                preferences: { ...editForm.preferences, pets: e.target.checked }
              })}
              className="mr-2"
            />
            <label>Pets allowed</label>
          </div>
          <button
            type="submit"
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Profile
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {/* Avatar */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mt-4">{profile.name}</h2>
              {profile.verified && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2">
                  Verified Profile
                </span>
              )}
            </div>

            {/* Quick Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-3" />
                <span className="text-sm">{profile.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-3" />
                <span className="text-sm">{profile.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <GraduationCap className="w-4 h-4 mr-3" />
                <span className="text-sm">{profile.course}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-3" />
                <span className="text-sm">{profile.college}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-3" />
                <span className="text-sm">{profile.year}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.course}
                    onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.course}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                {isEditing ? (
                  <select
                    value={editForm.year}
                    onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{profile.year}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">College</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.college}
                    onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.college}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profile.bio}</p>
              )}
            </div>
          </div>

          {/* Roommate Preferences */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Roommate Preferences</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender Preference</label>
                {isEditing ? (
                  <select
                    value={editForm.preferences.gender}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      preferences: { ...editForm.preferences, gender: e.target.value }
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="any">Any</option>
                  </select>
                ) : (
                  <p className="text-gray-900 capitalize">{profile.preferences.gender}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lifestyle</label>
                {isEditing ? (
                  <select
                    value={editForm.preferences.lifestyle}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      preferences: { ...editForm.preferences, lifestyle: e.target.value }
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="quiet">Quiet</option>
                    <option value="moderate">Moderate</option>
                    <option value="social">Social</option>
                  </select>
                ) : (
                  <p className="text-gray-900 capitalize">{profile.preferences.lifestyle}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={editForm.preferences.budget.min}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        preferences: {
                          ...editForm.preferences,
                          budget: { ...editForm.preferences.budget, min: parseInt(e.target.value) }
                        }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={editForm.preferences.budget.max}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        preferences: {
                          ...editForm.preferences,
                          budget: { ...editForm.preferences.budget, max: parseInt(e.target.value) }
                        }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900">₹{profile.preferences.budget.min.toLocaleString()} - ₹{profile.preferences.budget.max.toLocaleString()}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cleanliness</label>
                {isEditing ? (
                  <select
                    value={editForm.preferences.cleanliness}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      preferences: { ...editForm.preferences, cleanliness: e.target.value }
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="neat">Very Neat</option>
                    <option value="average">Average</option>
                    <option value="flexible">Flexible</option>
                  </select>
                ) : (
                  <p className="text-gray-900 capitalize">{profile.preferences.cleanliness}</p>
                )}
              </div>
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="smoking"
                  checked={editForm.preferences.smoking}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    preferences: { ...editForm.preferences, smoking: e.target.checked }
                  })}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="smoking" className="ml-2 text-sm text-gray-700">Smoking allowed</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pets"
                  checked={editForm.preferences.pets}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    preferences: { ...editForm.preferences, pets: e.target.checked }
                  })}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="pets" className="ml-2 text-sm text-gray-700">Pets allowed</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}