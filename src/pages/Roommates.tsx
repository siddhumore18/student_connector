import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, DollarSign, Calendar, Heart, MessageCircle, Star, Users } from 'lucide-react';

// Mock data - replace with API calls
const mockRoommates = [
  {
    id: '1',
    user: {
      name: 'Anita Sharma',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    title: 'Looking for a neat and quiet female roommate',
    location: 'Near IIT Delhi, Hauz Khas',
    budget: 8000,
    availableFrom: '2024-02-01',
    preferences: {
      gender: 'female',
      lifestyle: 'quiet',
      cleanliness: 'neat',
      smoking: false,
      pets: false,
    },
    verified: true,
    rating: 4.8,
  },
  {
    id: '2',
    user: {
      name: 'Rohit Kumar',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    title: 'Social guy looking for roommate for 2BHK',
    location: 'Lajpat Nagar, Near Metro',
    budget: 12000,
    availableFrom: '2024-02-15',
    preferences: {
      gender: 'male',
      lifestyle: 'social',
      cleanliness: 'average',
      smoking: false,
      pets: true,
    },
    verified: true,
    rating: 4.6,
  },
  {
    id: '3',
    user: {
      name: 'Priya Patel',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    title: 'MBA student seeking study-focused roommate',
    location: 'Karol Bagh, Near DU',
    budget: 10000,
    availableFrom: '2024-01-20',
    preferences: {
      gender: 'female',
      lifestyle: 'moderate',
      cleanliness: 'neat',
      smoking: false,
      pets: false,
    },
    verified: false,
    rating: 4.9,
  },
];

export default function Roommates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    gender: 'any',
    budgetRange: [5000, 20000],
    lifestyle: 'any',
    verifiedOnly: false,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Roommate</h1>
          <p className="text-gray-600">Connect with compatible people based on lifestyle and preferences</p>
        </div>
        <Link
          to="/add-roommate-profile"
          className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Users className="w-5 h-5 mr-2" />
          Create Roommate Profile
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by location, preferences, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200 grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender Preference</label>
              <select
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="any">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>₹5,000 - ₹10,000</option>
                <option>₹10,000 - ₹15,000</option>
                <option>₹15,000 - ₹20,000</option>
                <option>₹20,000+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lifestyle</label>
              <select
                value={filters.lifestyle}
                onChange={(e) => setFilters({ ...filters, lifestyle: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="any">Any</option>
                <option value="quiet">Quiet</option>
                <option value="moderate">Moderate</option>
                <option value="social">Social</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="verified"
                checked={filters.verifiedOnly}
                onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="verified" className="ml-2 text-sm text-gray-700">Verified profiles only</label>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockRoommates.map((roommate) => (
          <div key={roommate.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Profile Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={roommate.user.avatar}
                    alt={roommate.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      {roommate.user.name}
                      {roommate.verified && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Verified
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      {roommate.rating}
                    </div>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Title */}
              <h4 className="font-medium text-gray-900 mb-3">{roommate.title}</h4>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {roommate.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  ₹{roommate.budget.toLocaleString()}/month
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Available from {new Date(roommate.availableFrom).toLocaleDateString()}
                </div>
              </div>

              {/* Preferences Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {roommate.preferences.gender}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  {roommate.preferences.lifestyle}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {roommate.preferences.cleanliness}
                </span>
                {!roommate.preferences.smoking && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    No smoking
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <button className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
          Load More Profiles
        </button>
      </div>
    </div>
  );
}