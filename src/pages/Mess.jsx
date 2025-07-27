import React, { useState, useEffect } from 'react';
import { subscribeToMessServices } from '../services/firebase.js';
import { Calendar, Clock, Star, Check, UtensilsCrossed, Leaf, X, MapPin, DollarSign, Phone } from 'lucide-react';
import { addCommentToListing, subscribeToComments, deleteComment, getUserProfile } from '../services/firebase.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

// Default sample menu for display
const defaultMenu = {
  breakfast: ['Poha', 'Samosa', 'Tea/Coffee', 'Fruits'],
  lunch: ['Rice', 'Dal', 'Sabji', 'Roti', 'Pickle', 'Curd'],
  dinner: ['Chapati', 'Rajma', 'Aloo Gobhi', 'Rice', 'Sweet'],
};

const mealTimes = [
  { id: 'breakfast', name: 'Breakfast', time: '7:00 AM - 10:00 AM', icon: '🌅' },
  { id: 'lunch', name: 'Lunch', time: '12:00 PM - 3:00 PM', icon: '☀️' },
  { id: 'dinner', name: 'Dinner', time: '7:00 PM - 10:00 PM', icon: '🌙' },
];

export default function Mess() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messServices, setMessServices] = useState([]);
  const [selectedMess, setSelectedMess] = useState(null);
  const [selectedMeal, setSelectedMeal] = 'lunch';
  const [showSubscription, setShowSubscription] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleMessClick = (mess) => {
    setSelectedMess(mess);
    setShowDetails(true);
  };
  const closeDetails = () => setShowDetails(false);

  useEffect(() => {
    const unsubscribe = subscribeToMessServices((services) => {
      setMessServices(services);
      if (services.length > 0 && !selectedMess) {
        setSelectedMess(services[0]);
      }
    });

    return () => unsubscribe();
  }, [selectedMess]);

  if (messServices.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <UtensilsCrossed className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Mess Services Available</h2>
        <p className="text-gray-600">Mess services will appear here once approved by admin.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Campus Mess Services
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Subscribe to healthy, affordable meal plans and view daily menus from campus mess facilities.
        </p>
      </div>

      {/* Today's Highlight */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl text-white p-8 mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Today's Special</h2>
            <p className="text-emerald-100 mb-4">
              {selectedMess ? `Fresh meals at ${selectedMess.providerName}` : 'Fresh meals available'}
            </p>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
                <Leaf className="w-4 h-4 mr-1" />
                Fresh
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
                <Star className="w-4 h-4 mr-1" />
                Quality Food
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              ₹{selectedMess?.pricing?.lunch || 180}
            </div>
            <div className="text-emerald-100">per meal</div>
          </div>
        </div>
      </div>

      {/* Mess Selection */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Mess Facility</h3>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {messServices.map((mess) => (
            <div
              key={mess.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full cursor-pointer"
              onClick={() => navigate(`/mess/${mess.id}`)}
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={mess.imageUrls?.[0] || "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400"}
                    alt={mess.providerName}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{mess.providerName}</h4>
                    <div className="flex items-center mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-gray-600">4.5 rating</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{mess.address}</p>
                    <div className="flex flex-wrap gap-2">
                      {['Fresh', 'Hygienic', 'Quality'].map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {user && (
                <div className="pt-4 pb-2 px-2 sm:px-4 mt-4 border-t border-gray-100">
                  <Comments collectionName="messServices" listingId={mess.id} currentUser={user} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mess Details Modal */}
      {showDetails && selectedMess && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative border border-blue-100">
            <button onClick={closeDetails} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <X className="w-7 h-7" />
            </button>
            <div className="flex flex-col md:flex-row items-center mb-8 gap-8">
              <img
                src={selectedMess.imageUrls?.[0] || "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400"}
                alt={selectedMess.providerName}
                className="w-32 h-32 rounded-2xl object-cover shadow-md border border-gray-200"
              />
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-extrabold text-blue-700 mb-1">{selectedMess.providerName}</h2>
                <p className="text-gray-500 mb-2 flex items-center justify-center md:justify-start"><MapPin className="w-4 h-4 mr-1" />{selectedMess.address}</p>
                <div className="flex items-center justify-center md:justify-start text-sm text-gray-500 mb-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">4.5 rating</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {['Fresh', 'Hygienic', 'Quality'].map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center"><UtensilsCrossed className="w-5 h-5 mr-2 text-blue-600" />Sample Menu</h3>
              <pre className="bg-blue-50 rounded-xl p-4 text-sm text-blue-900 whitespace-pre-wrap border border-blue-100">{selectedMess.menuSample || 'No menu available.'}</pre>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center"><DollarSign className="w-5 h-5 mr-2 text-green-600" />Pricing</h3>
              {selectedMess.pricing && (
                <ul className="grid grid-cols-2 gap-2 text-gray-800 text-sm">
                  {Object.entries(selectedMess.pricing).map(([plan, price]) => (
                    <li key={plan} className="flex items-center justify-between bg-emerald-50 rounded-lg px-3 py-2">
                      <span className="font-medium capitalize">{plan}</span>
                      <span className="font-bold text-green-700">₹{price} <span className="text-xs font-normal">/day</span></span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mb-2">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center"><Phone className="w-5 h-5 mr-2 text-blue-600" />Contact</h3>
              <div className="flex flex-col gap-1 text-gray-700 text-sm">
                <span><b>Contact Person:</b> {selectedMess.contactPerson || 'N/A'}</span>
                {selectedMess.phone && <span><b>Phone:</b> {selectedMess.phone}</span>}
                {selectedMess.email && <span><b>Email:</b> {selectedMess.email}</span>}
              </div>
            </div>
          </div>
        </div>
      )}
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