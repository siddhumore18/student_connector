import React, { useState, useEffect } from 'react';
import { subscribeToHousingListings } from '../services/firebase';
import { Search, Filter, MapPin, DollarSign, Bed, Bath, Car, Wifi, Heart, Phone, Star, Shield } from 'lucide-react';


const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  furnished: Bed,
  ac: '❄️',
  security: Shield,
  meals: '🍽️',
  laundry: '🧺',
  cleaning: '🧹',
  garden: '🌿',
  pets: '🐕',
};

export default function Housing() {
  const [housingListings, setHousingListings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    budget: 'all',
    amenities: [],
  });

  useEffect(() => {
    const unsubscribe = subscribeToHousingListings(setHousingListings);
    return () => unsubscribe();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'apartment':
        return 'bg-blue-100 text-blue-800';
      case 'pg':
        return 'bg-emerald-100 text-emerald-800';
      case 'house':
        return 'bg-orange-100 text-orange-800';
      case 'hostel':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (housingListings.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Housing Listings Available</h2>
        <p className="text-gray-600">Housing listings will appear here once approved by admin.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Home</h1>
          <p className="text-gray-600">Discover apartments, PGs, and shared accommodations near your campus</p>
        </div>
        <button className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
          <MapPin className="w-5 h-5 mr-2" />
          List Your Property
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by location, type, or amenities..."
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
          <div className="mt-6 pt-6 border-t border-gray-200 grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="pg">PG</option>
                <option value="house">House</option>
                <option value="hostel">Hostel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
              <select
                value={filters.budget}
                onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Any Budget</option>
                <option value="0-15000">₹0 - ₹15,000</option>
                <option value="15000-25000">₹15,000 - ₹25,000</option>
                <option value="25000-35000">₹25,000 - ₹35,000</option>
                <option value="35000+">₹35,000+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <div className="grid grid-cols-2 gap-2">
                {['wifi', 'parking', 'furnished', 'meals'].map((amenity) => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-6">
        {housingListings.map((housing) => (
          <div key={housing.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="md:flex">
              {/* Image */}
              <div className="md:w-1/3">
                <div className="relative h-64 md:h-full">
                  <img
                    src={housing.images?.[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={housing.title}
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 rounded-full text-gray-600 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  {housing.images && housing.images.length > 1 && (
                    <div className="absolute bottom-4 left-4 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                      +{housing.images.length - 1} more
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="md:w-2/3 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(housing.type)}`}>
                        {housing.type.toUpperCase()}
                      </span>
                      {housing.contact?.verified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{housing.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{housing.location}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        {housing.propertyDetails?.bedrooms || housing.details?.bedrooms || 1} Bed
                      </span>
                      <span className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        {housing.propertyDetails?.bathrooms || housing.details?.bathrooms || 1} Bath
                      </span>
                      <span>{housing.propertyDetails?.area || housing.details?.area || 'N/A'} sq ft</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">₹{housing.rent.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">per month</div>
                    <div className="text-xs text-gray-400 mt-1">₹{housing.deposit.toLocaleString()} deposit</div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(housing.amenities || []).slice(0, 5).map((amenity: string) => {
                    const Icon = amenityIcons[amenity as keyof typeof amenityIcons];
                    return (
                      <span
                        key={amenity}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {typeof Icon === 'string' ? (
                          <span className="mr-1">{Icon}</span>
                        ) : (
                          <Icon className="w-3 h-3 mr-1" />
                        )}
                        {amenity}
                      </span>
                    );
                  })}
                  {housing.amenities && housing.amenities.length > 5 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      +{housing.amenities.length - 5} more
                    </span>
                  )}
                </div>

                {/* Contact and Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-gray-600">{housing.rating || '4.5'}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Contact: {housing.contact?.name || housing.ownerDetails?.name}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <button className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
          Load More Properties
        </button>
      </div>
    </div>
  );
}