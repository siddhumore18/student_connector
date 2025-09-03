import React, { useState, useEffect } from 'react';
import { subscribeToHousingListings } from '../services/firebase.js';
import { Search, Filter, MapPin, DollarSign, Bed, Bath, Car, Wifi, Heart, Phone, Star, Shield, Building, X, FileText } from 'lucide-react';
import { addCommentToListing, subscribeToComments, deleteComment, getUserProfile } from '../services/firebase.js';
import { useAuth } from '../contexts/AuthContext.jsx';


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
  const { user } = useAuth();
  const [housingListings, setHousingListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    budget: 'all',
    amenities: [],
  });
  const [showDetails, setShowDetails] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  const handleContactClick = (listing) => {
    setSelectedListing(listing);
    setShowDetails(true);
  };
  const closeDetails = () => setShowDetails(false);

  useEffect(() => {
    const unsubscribe = subscribeToHousingListings(setHousingListings);
    return () => unsubscribe();
  }, []);

  const getTypeColor = (type) => {
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
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
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
      <div className="space-y-4 sm:space-y-6">
        {housingListings.map((housing) => (
          <div key={housing.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
            <div className="md:flex">
              {/* Images */}
              <div className="md:w-1/3 p-4">
                <div className="relative">
                  {/* Main Image */}
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
                    <img
                      src={housing.images?.[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={housing.title}
                      className="w-full h-full object-cover"
                    />
                    <button className="absolute top-2 right-2 p-1.5 bg-white bg-opacity-90 rounded-full text-gray-600 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Thumbnail Gallery */}
                  {housing.images && housing.images.length > 1 && (
                    <div className="grid grid-cols-3 gap-1">
                      {housing.images.slice(1, 4).map((img, i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={img}
                            alt={`${housing.title} ${i + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {housing.images.length > 4 && (
                        <div className="aspect-square bg-gray-900 bg-opacity-75 rounded-lg flex items-center justify-center text-white text-xs font-medium">
                          +{housing.images.length - 4}
                        </div>
                      )}
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
                    <div className="text-2xl font-bold text-gray-900">₹{housing.rent?.toLocaleString?.() || housing.rent}</div>
                    <div className="text-sm text-gray-500">per month</div>
                    <div className="text-xs text-gray-400 mt-1">₹{housing.deposit?.toLocaleString?.() || housing.deposit} deposit</div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(housing.amenities || []).slice(0, 5).map((amenity) => {
                    const Icon = amenityIcons[amenity];
                    return (
                      <span
                        key={amenity}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {Icon && typeof Icon !== 'string' ? <Icon className="w-3 h-3 mr-1" /> : null}
                        {Icon && typeof Icon === 'string' ? <span className="mr-1">{Icon}</span> : null}
                        {(!Icon) ? null : null}
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
                    {/* <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                      View Details
                    </button> */}
                    <button
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => handleContactClick(housing)}
                    >
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

      {/* Housing Details Modal */}
      {showDetails && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative border border-blue-100">
            <button onClick={closeDetails} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <X className="w-7 h-7" />
            </button>
            <div className="flex flex-col md:flex-row items-center mb-8 gap-8">
              <img
                src={selectedListing.images?.[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={selectedListing.title}
                className="w-32 h-32 rounded-2xl object-cover shadow-md border border-gray-200"
              />
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-extrabold text-blue-700 mb-1">{selectedListing.title}</h2>
                <p className="text-gray-500 mb-2 flex items-center justify-center md:justify-start"><MapPin className="w-4 h-4 mr-1" />{selectedListing.location}</p>
                <div className="flex items-center justify-center md:justify-start text-sm text-gray-500 mb-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">{selectedListing.rating || '4.5'} rating</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {(selectedListing.amenities || []).map((amenity) => {
                    const Icon = amenityIcons[amenity];
                    return (
                      <span
                        key={amenity}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {Icon && typeof Icon !== 'string' ? <Icon className="w-3 h-3 mr-1" /> : null}
                        {Icon && typeof Icon === 'string' ? <span className="mr-1">{Icon}</span> : null}
                        {(!Icon) ? null : null}
                        {amenity}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center"><Building className="w-5 h-5 mr-2 text-blue-600" />Property Details</h3>
              <div className="grid grid-cols-2 gap-2 text-gray-800 text-sm">
                <span><b>Type:</b> {selectedListing.type}</span>
                <span><b>Bedrooms:</b> {selectedListing.propertyDetails?.bedrooms || selectedListing.details?.bedrooms || 1}</span>
                <span><b>Bathrooms:</b> {selectedListing.propertyDetails?.bathrooms || selectedListing.details?.bathrooms || 1}</span>
                <span><b>Area:</b> {selectedListing.propertyDetails?.area || selectedListing.details?.area || 'N/A'} sq ft</span>
                <span><b>Furnished:</b> {selectedListing.propertyDetails?.furnished ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center"><DollarSign className="w-5 h-5 mr-2 text-green-600" />Pricing</h3>
              <div className="grid grid-cols-2 gap-2 text-gray-800 text-sm">
                <span><b>Rent:</b> ₹{selectedListing.rent}</span>
                <span><b>Deposit:</b> ₹{selectedListing.deposit}</span>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center"><Phone className="w-5 h-5 mr-2 text-blue-600" />Contact Info</h3>
              <div className="flex flex-col gap-1 text-gray-700 text-sm">
                <span><b>Contact Person:</b> {selectedListing.contact?.name || selectedListing.ownerDetails?.name}</span>
                {selectedListing.contact?.phone && <span><b>Phone:</b> {selectedListing.contact.phone}</span>}
                {selectedListing.contact?.email && <span><b>Email:</b> {selectedListing.contact.email}</span>}
              </div>
            </div>
            <div className="mb-2">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center"><FileText className="w-5 h-5 mr-2 text-blue-600" />Description</h3>
              <p className="text-gray-700 text-sm">{selectedListing.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Load More */}
      <div className="text-center mt-10 md:mt-12">
        <button className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
          Load More Properties
        </button>
      </div>
    </div>
  );
}

function Comments({ collectionName, listingId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [userProfiles, setUserProfiles] = useState({});
  useEffect(() => {
    const unsubscribe = subscribeToComments(collectionName, listingId, async (comments) => {
      setComments(comments);
      // Fetch user profiles for all commenters
      const ids = Array.from(new Set(comments.map(c => c.userId)));
      const profiles = {};
      for (const id of ids) {
        if (!id) continue;
        profiles[id] = await getUserProfile(id);
      }
      setUserProfiles(profiles);
    });
    return () => unsubscribe && unsubscribe();
  }, [collectionName, listingId]);
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    await addCommentToListing(collectionName, listingId, currentUser.id, commentInput.trim());
    setCommentInput('');
  };
  const handleDeleteComment = async (comment) => {
    if (!window.confirm('Delete this comment?')) return;
    await deleteComment(collectionName, listingId, comment.id);
  };
  return (
    <div className="mt-2 sm:mt-3 mb-2 sm:mb-3">
      <div className="font-semibold text-gray-700 mb-2">Comments</div>
      <form onSubmit={handleAddComment} className="flex flex-col sm:flex-row gap-2 mb-3">
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300"
          placeholder="Add a comment..."
          value={commentInput}
          onChange={e => setCommentInput(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">Post</button>
      </form>
      <div className="space-y-2 sm:space-y-3">
        {comments.map(comment => {
          const profile = userProfiles[comment.userId];
          return (
            <div key={comment.id} className="flex items-start gap-2 sm:gap-3">
              <img
                src={profile?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'}
                alt={profile?.name || 'User'}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-blue-200"
              />
              <div className="flex-1 bg-gray-100 rounded-xl px-3 py-2 sm:px-4 sm:py-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-gray-900">{profile?.name || 'User'}</span>
                  <span className="text-xs text-gray-400">{comment.timestamp?.toDate ? new Date(comment.timestamp.toDate()).toLocaleString() : ''}</span>
                  {comment.userId === currentUser.id && (
                    <button onClick={() => handleDeleteComment(comment)} className="ml-0 sm:ml-2 text-xs text-red-500 hover:underline">Delete</button>
                  )}
                </div>
                <div className="text-gray-800 text-xs sm:text-sm mt-1 break-words">{comment.text}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}