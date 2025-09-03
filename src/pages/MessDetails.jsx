import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDocs, collection, query, where, doc, getDoc } from 'firebase/firestore';
import { db, subscribeToComments, addCommentToListing, deleteComment, getUserProfile } from '../services/firebase.js';
import { Star, UtensilsCrossed, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

function Comments({ collectionName, listingId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [userProfiles, setUserProfiles] = useState({});

  useEffect(() => {
    const unsubscribe = subscribeToComments(collectionName, listingId, async (comments) => {
      setComments(comments);
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
    <div className="mt-6">
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

export default function MessDetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const [mess, setMess] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // New state for selected image in the gallery
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchMess() {
      setLoading(true);
      if (!id) {
        setLoading(false);
        return;
      }
      const docRef = doc(db, 'messServices', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const messData = { id: snap.id, ...snap.data() };
        setMess(messData);
        // Set the first image as the selected one, or a placeholder
        setSelectedImage(messData.images?.[0] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400');
      } else {
        // Fallback query if needed (though direct doc get is better)
        const q = query(collection(db, 'messServices'), where('id', '==', id));
        const qSnap = await getDocs(q);
        if (!qSnap.empty) {
            const messData = { id: qSnap.docs[0].id, ...qSnap.docs[0].data() };
            setMess(messData);
            setSelectedImage(messData.images?.[0] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400');
        }
      }
      setLoading(false);
    }
    fetchMess();
  }, [id]);

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (!mess) return <div className="text-center py-16">Mess not found.</div>;

  const images = mess.images || [];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
      <Link to="/mess" className="inline-flex items-center text-blue-600 hover:underline mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Mess List
      </Link>

      {/* Details */}
      <div className="bg-white rounded-2xl shadow p-6 md:p-10 mb-10">
        <div className="flex flex-col md:flex-row gap-10 mb-10">
          {/* Image Gallery */}
          <div className="flex-shrink-0 w-full md:w-96">
            {/* Main Image */}
            <div className="relative bg-gray-100 rounded-2xl overflow-hidden mb-4 aspect-square">
              <img 
                src={selectedImage} 
                alt="Mess" 
                className="object-cover w-full h-full"
              />
              {images.length > 1 && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                  {images.findIndex(img => img === selectedImage) + 1} / {images.length}
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${
                      selectedImage === img ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img
                      src={img}
                      alt={`Mess thumbnail ${i + 1}`}
                      className="object-cover w-full h-full"
                    />
                    {selectedImage === img && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                        <Check className="w-6 h-6 text-blue-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-blue-700 mb-3">{mess.providerName || 'Mess Service'}</h1>
            <div className="flex items-center gap-3 mb-3">
              <Star className="w-6 h-6 text-yellow-400" />
              <span className="font-semibold text-xl">{mess.rating || '4.5'}</span>
              <span className="text-gray-500 text-base">({mess.reviews || 0} reviews)</span>
            </div>
            <div className="text-gray-600 mb-3 text-lg">{mess.description || ''}</div>
            <div className="flex flex-col gap-1 text-base text-gray-700 mb-3">
              <span><b>Contact:</b> {mess.contactPerson || 'N/A'} ({mess.phone || 'N/A'})</span>
              <span><b>Location:</b> {mess.address || ''}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(mess.tags || ['Fresh', 'Hygienic']).map(tag => (
                <span key={tag} className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <Comments collectionName="messServices" listingId={mess.id} currentUser={user} />
      </div>

      {/* Menu + Subscription */}
      <div className="flex flex-col md:flex-row gap-6 mt-12">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Today's Menu */}
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-4 sm:p-6 flex flex-col">
            <h3 className="text-lg font-bold text-blue-700 mb-4">Today's Menu</h3>
            <div className="h-40 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-blue-200">
              {(mess.menu?.today?.length > 0 ? mess.menu.today : ['No menu available for today.']).map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100 shadow-sm text-sm">
                  <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
                  <span className="text-gray-900">{item.trim()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Week's Specials */}
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-bold text-blue-700 mb-3">This Week's Special Menu</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
              {(mess.menu?.weekSpecial?.length > 0 ? mess.menu.weekSpecial : ['No special menu for this week.']).map((item, index) => (
                <div key={index} className="min-w-[160px] bg-blue-50 rounded-lg p-3 border border-blue-100 text-sm text-gray-800 flex-shrink-0 flex items-center justify-center snap-start shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="flex-1 bg-white rounded-2xl shadow border border-gray-200 p-4 sm:p-6 flex flex-col min-h-72">
          <h3 className="text-lg font-bold text-blue-700 mb-3">Subscription Plans</h3>
          <div className="space-y-3 flex-1">
            {mess.pricing && Object.entries(mess.pricing).length > 0 ? (
              Object.entries(mess.pricing).map(([plan, price]) => (
                <div key={plan} className="p-3 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors bg-blue-50/50 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 capitalize text-sm">{plan}</h4>
                    <span className="text-base font-bold text-blue-600">₹{price}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">Per day</p>
                  <button className="w-full py-1 px-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm">Subscribe</button>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No subscription plans available.</div>
            )}
          </div>
          {/* Monthly Calculation */}
          <div className="mt-4 p-2 bg-emerald-50 rounded-xl border border-emerald-100 text-xs">
            <h4 className="font-medium text-emerald-800 mb-1">Full Plan (Monthly)</h4>
            <div className="text-lg font-bold text-emerald-600">
              ₹{mess.pricing?.full ? (mess.pricing.full * 30).toLocaleString() : '13,500'}
            </div>
            <p className="text-xs text-emerald-700">Save ₹2,500/month vs individual meals</p>
          </div>
          {/* Features */}
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2 text-sm">What's Included</h4>
            <div className="space-y-1">
              {[
                'Fresh, hygienic food',
                'Flexible timing',
                'Monthly refund policy',
                'Special diet options',
                'Weekend variety menu',
              ].map((feature, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}