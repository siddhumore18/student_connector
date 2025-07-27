import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, DollarSign, Calendar, Heart, MessageCircle, Star, Users, X, Phone } from 'lucide-react';
import { subscribeToRoommateProfiles } from '../services/firebase.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getOrCreateChat, sendMessage, subscribeToMessages, subscribeToUserChats, getUserProfile, deleteMessage, addCommentToListing, subscribeToComments, deleteComment } from '../services/firebase.js';

function MyChats({ user, openChatWithRoommate, activeChatId }) {
  const [chats, setChats] = useState([]);
  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToUserChats(user.id, setChats);
    return () => unsubscribe && unsubscribe();
  }, [user]);
  if (!user) return null;
  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-2xl shadow border border-blue-100">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">My Chats</h2>
      {chats.length === 0 ? (
        <div className="text-gray-500 text-center">No conversations yet.</div>
      ) : (
        <ul className="divide-y divide-blue-50">
          {chats.map(chat => (
            <li
              key={chat.id}
              className={`py-4 flex items-center gap-4 cursor-pointer hover:bg-blue-50 rounded-xl px-2 ${activeChatId === chat.id ? 'bg-blue-50' : ''}`}
              onClick={() => openChatWithRoommate(chat)}
            >
              <img
                src={chat.otherUser?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'}
                alt={chat.otherUser?.name || 'User'}
                className="w-12 h-12 rounded-full object-cover border border-blue-200"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{chat.otherUser?.name || 'User'}</div>
                <div className="text-sm text-gray-500 truncate">{chat.lastMessage?.text || 'No messages yet.'}</div>
              </div>
              {chat.lastMessage && chat.lastMessage.senderId !== user.id && !chat.lastMessage.read && (
                <span className="inline-block w-3 h-3 bg-blue-600 rounded-full" title="Unread"></span>
              )}
            </li>
          ))}
        </ul>
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
    <div className="mt-3 sm:mt-4">
      <div className="font-semibold text-gray-700 mb-1 sm:mb-2">Comments</div>
      <form onSubmit={handleAddComment} className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4">
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

export default function Roommates() {
  const [roommates, setRoommates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    gender: 'any',
    budgetRange: [5000, 20000],
    lifestyle: 'any',
    verifiedOnly: false,
  });
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRoommate, setSelectedRoommate] = useState(null);
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showInbox, setShowInbox] = useState(false);

  const handleContactClick = (roommate) => {
    setSelectedRoommate(roommate);
    setShowDetails(true);
  };
  const closeDetails = () => setShowDetails(false);

  const openChatWithRoommate = async (chatOrRoommate) => {
    setChatLoading(true);
    let chat;
    if (chatOrRoommate.id && chatOrRoommate.userIds) {
      // It's a chat object from inbox
      chat = chatOrRoommate;
    } else {
      // It's a roommate profile, get or create chat
      const otherUserId = chatOrRoommate.userId || chatOrRoommate.id;
      const chatId = await getOrCreateChat(user.id, otherUserId);
      chat = { id: chatId, otherUser: chatOrRoommate.user || chatOrRoommate };
    }
    setActiveChat(chat);
    setShowInbox(false);
    setShowChat(true);
    setChatInput('');
    setChatMessages([]);
    setChatLoading(true);
    const unsubscribe = subscribeToMessages(chat.id, (msgs) => {
      setChatMessages(msgs);
      setChatLoading(false);
    });
    // Clean up on close
    return () => unsubscribe && unsubscribe();
  };
  const closeChat = () => {
    setShowChat(false);
    setActiveChat(null);
    setChatMessages([]);
    setChatInput('');
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChat) return;
    await sendMessage(activeChat.id, user.id, chatInput.trim());
    setChatInput('');
  };
  const handleDeleteMessage = async (msg) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await deleteMessage(activeChat.id, msg.id);
    } catch (err) {
      alert('Failed to delete message');
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToRoommateProfiles(setRoommates);
    return () => unsubscribe();
  }, []);

  const notificationSoundUrl = 'https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa1b82.mp3'; // Free notification sound

  useEffect(() => {
    // Request browser notification permission on mount
    if (window.Notification && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!activeChat) return;
    setChatLoading(true);
    const unsubscribe = subscribeToMessages(activeChat.id, (msgs) => {
      // Detect new message for notification
      if (msgs.length > 0 && chatMessages.length > 0) {
        const lastMsg = msgs[msgs.length - 1];
        const prevLastMsg = chatMessages[chatMessages.length - 1];
        if (
          lastMsg.id !== prevLastMsg.id &&
          lastMsg.senderId !== user.id // Only notify if message is from other user
        ) {
          // Play sound
          const audio = new Audio(notificationSoundUrl);
          audio.play();
          // Show browser notification
          if (window.Notification && Notification.permission === 'granted') {
            new Notification(activeChat.otherUser?.name || 'New Message', {
              body: lastMsg.text,
              icon: activeChat.otherUser?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
            });
          }
        }
      }
      setChatMessages(msgs);
      setChatLoading(false);
    });
    return () => unsubscribe && unsubscribe();
    // eslint-disable-next-line
  }, [activeChat, user.id, chatMessages]);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Roommate</h1>
          <p className="text-gray-600">Connect with compatible people based on lifestyle and preferences</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/add-roommate-profile"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Users className="w-5 h-5 mr-2" />
            Create Roommate Profile
          </Link>
          {/* <button
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-white text-blue-600 border border-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-colors"
            onClick={() => setShowInbox(true)}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            My Chats
          </button> */}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 md:mb-8">
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
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roommates.map((roommate) => (
          <div key={roommate.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
            <div className="p-6">
              {/* Profile Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={roommate.user?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'}
                    alt={roommate.user?.name || roommate.title}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      {roommate.user?.name || roommate.title}
                      {roommate.verified && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Verified
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      {roommate.rating || '4.5'}
                    </div>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  {/* <MessageCircle className="w-5 h-5" /> */}
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
                  ₹{roommate.budget?.toLocaleString?.() || roommate.budget}/month
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Available from {roommate.availableFrom ? new Date(roommate.availableFrom).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              {/* Preferences Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {roommate.preferences?.gender}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  {roommate.preferences?.lifestyle}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {roommate.preferences?.cleanliness}
                </span>
                {!roommate.preferences?.smoking && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    No smoking
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => handleContactClick(roommate)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact
                </button>
                {/* <button
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => openChatWithRoommate(roommate)}
                >
                  Chat
                </button> */}
                {/* <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  View Profile
                </button> */}
              </div>
              <Comments collectionName="roommateProfiles" listingId={roommate.id} currentUser={user} />
            </div>
          </div>
        ))}
      </div>

      {/* Roommate Details Modal */}
      {showDetails && selectedRoommate && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative border border-blue-100">
            <button onClick={closeDetails} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <X className="w-7 h-7" />
            </button>
            <div className="flex flex-col items-center mb-8 gap-4">
              <img
                src={selectedRoommate.user?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'}
                alt={selectedRoommate.user?.name || selectedRoommate.title}
                className="w-24 h-24 rounded-full object-cover shadow-md border border-gray-200 mb-2"
              />
              <h2 className="text-2xl font-extrabold text-blue-700 mb-1">{selectedRoommate.user?.name || selectedRoommate.title}</h2>
              <p className="text-gray-500 mb-2 flex items-center"><MapPin className="w-4 h-4 mr-1" />{selectedRoommate.location}</p>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                <span className="font-medium">{selectedRoommate.rating || '4.5'} rating</span>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center"><Users className="w-5 h-5 mr-2 text-blue-600" />Preferences</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {selectedRoommate.preferences?.gender}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  {selectedRoommate.preferences?.lifestyle}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {selectedRoommate.preferences?.cleanliness}
                </span>
                {!selectedRoommate.preferences?.smoking && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    No smoking
                  </span>
                )}
                {selectedRoommate.preferences?.pets && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pets allowed
                  </span>
                )}
              </div>
              <div className="flex gap-2 text-sm text-gray-700">
                <span><b>Budget:</b> ₹{selectedRoommate.budget}</span>
                <span><b>Available from:</b> {selectedRoommate.availableFrom ? new Date(selectedRoommate.availableFrom).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center"><Phone className="w-5 h-5 mr-2 text-blue-600" />Contact Info</h3>
              <div className="flex flex-col gap-1 text-gray-700 text-sm">
                {selectedRoommate.contactInfo?.whatsapp && <span><b>WhatsApp:</b> {selectedRoommate.contactInfo.whatsapp}</span>}
                {selectedRoommate.contactInfo?.telegram && <span><b>Telegram:</b> {selectedRoommate.contactInfo.telegram}</span>}
              </div>
            </div>
            <div className="mb-2">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center"><Users className="w-5 h-5 mr-2 text-blue-600" />About</h3>
              <p className="text-gray-700 text-sm">{selectedRoommate.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChat && activeChat && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative border border-blue-100 flex flex-col">
            <button onClick={closeChat} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <X className="w-7 h-7" />
            </button>
            <div className="flex items-center mb-6 gap-4">
              <img
                src={activeChat.otherUser?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'}
                alt={activeChat.otherUser?.name || 'User'}
                className="w-14 h-14 rounded-full object-cover border border-gray-200"
              />
              <div>
                <h2 className="text-xl font-bold text-blue-700 mb-1">Chat with {activeChat.otherUser?.name || 'User'}</h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-blue-50 rounded-xl p-4 mb-4" style={{ maxHeight: 300 }}>
              {chatLoading ? (
                <div className="text-center text-gray-400">Loading chat...</div>
              ) : chatMessages.length === 0 ? (
                <div className="text-center text-gray-400">No messages yet. Say hello!</div>
              ) : (
                chatMessages.map(msg => (
                  <div key={msg.id} className={`mb-2 flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-4 py-2 rounded-xl max-w-xs flex items-end gap-2 ${msg.senderId === user.id ? 'bg-blue-600 text-white flex-row-reverse' : 'bg-white text-gray-900 border border-blue-100'}`}>
                      <img
                        src={msg.senderId === user.id ? user.avatar : activeChat.otherUser?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'}
                        alt={msg.senderId === user.id ? user.name : activeChat.otherUser?.name || 'User'}
                        className="w-7 h-7 rounded-full object-cover border border-blue-200"
                      />
                      <div>
                        <div className="font-semibold text-xs mb-1 flex items-center gap-2">{msg.senderId === user.id ? 'You' : activeChat.otherUser?.name || 'User'}
                          {msg.senderId === user.id && (
                            <button
                              onClick={() => handleDeleteMessage(msg)}
                              className="ml-2 text-xs text-red-500 hover:underline"
                              title="Delete message"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <div>{msg.text}</div>
                        <div className="text-xs text-gray-400 mt-1 text-right">{msg.timestamp?.toDate ? new Date(msg.timestamp.toDate()).toLocaleTimeString() : ''}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                disabled={chatLoading}
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors" disabled={chatLoading || !chatInput.trim()}>
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* My Chats Inbox */}
      {showInbox && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative border border-blue-100 flex flex-col">
            <button onClick={() => setShowInbox(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <X className="w-7 h-7" />
            </button>
            <MyChats user={user} openChatWithRoommate={openChatWithRoommate} activeChatId={activeChat?.id} />
          </div>
        </div>
      )}

      {/* Load More */}
      <div className="text-center mt-10 md:mt-12">
        <button className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
          Load More Profiles
        </button>
      </div>
    </div>
  );
}