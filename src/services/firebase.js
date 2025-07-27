import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, where, orderBy, updateDoc, doc, getDocs, serverTimestamp, collectionGroup, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Added for storage
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Added storage export
export const analytics = getAnalytics(app);

// --- NEW FILE UPLOAD FUNCTION ---
/**
 * Uploads a file to Firebase Storage.
 * @param {File} file - The file to upload.
 * @param {string} path - The path to store the file in (e.g., 'mess-images').
 * @returns {Promise<string>} The download URL of the uploaded file.
 */
export const uploadFile = async (file, path) => {
  if (!file) throw new Error("No file provided for upload.");
  const storageRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};


// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);

// Firestore functions
export const addMessRequest = async (messData) => {
  try {
    const docRef = await addDoc(collection(db, 'messRequests'), {
      ...messData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding mess request:', error);
    throw error;
  }
};

export const addHousingRequest = async (housingData) => {
  try {
    const docRef = await addDoc(collection(db, 'housingRequests'), {
      ...housingData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding housing request:', error);
    throw error;
  }
};

export const approveMessRequest = async (requestId, requestData) => {
  try {
    // Update request status
    await updateDoc(doc(db, 'messRequests', requestId), {
      status: 'approved',
      updatedAt: new Date()
    });

    // Add to approved mess services
    await addDoc(collection(db, 'messServices'), {
      ...requestData,
      approvedAt: new Date(),
      active: true
    });

    // Delete the original mess request document after approval
    await deleteDoc(doc(db, 'messRequests', requestId));
  } catch (error) {
    console.error('Error approving mess request:', error);
    throw error;
  }
};

export const approveHousingRequest = async (requestId, requestData) => {
  try {
    // Update request status
    await updateDoc(doc(db, 'housingRequests', requestId), {
      status: 'approved',
      updatedAt: new Date()
    });

    // Add to approved housing listings
    await addDoc(collection(db, 'housingListings'), {
      ...requestData,
      approvedAt: new Date(),
      available: true
    });
  } catch (error) {
    console.error('Error approving housing request:', error);
    throw error;
  }
};

export const rejectRequest = async (collection, requestId) => {
  try {
    await updateDoc(doc(db, collection, requestId), {
      status: 'rejected',
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
    throw error;
  }
};

// Real-time listeners
export const subscribeToMessRequests = (callback) => {
  const q = query(collection(db, 'messRequests'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(requests);
  });
};

export const subscribeToHousingRequests = (callback) => {
  const q = query(collection(db, 'housingRequests'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(requests);
  });
};

export const subscribeToMessServices = (callback) => {
  const q = query(collection(db, 'messServices'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const services = snapshot.docs.map(doc => ({
      id: doc.id, // Firestore document ID
      ...doc.data()
    }));
    callback(services);
  });
};

export const subscribeToHousingListings = (callback) => {
  const q = query(collection(db, 'housingListings'), orderBy('approvedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const listings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(listings);
  });
};

export const subscribeToRoommateProfiles = (callback) => {
  const q = query(collection(db, 'roommateProfiles'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const profiles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(profiles);
  });
};

export const addRoommateProfile = async (profileData) => {
  try {
    const docRef = await addDoc(collection(db, 'roommateProfiles'), {
      ...profileData,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding roommate profile:', error);
    throw error;
  }
};

export const addHousingListing = async (listingData) => {
  try {
    const docRef = await addDoc(collection(db, 'housingListings'), {
      ...listingData,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding housing listing:', error);
    throw error;
  }
};

export const addMessService = async (serviceData) => {
  try {
    const docRef = await addDoc(collection(db, 'messServices'), {
      ...serviceData,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding mess service:', error);
    throw error;
  }
};

// --- CHAT FUNCTIONS ---
// Get or create a chat between two users
export const getOrCreateChat = async (userId1, userId2) => {
  const users = [userId1, userId2].sort();
  const q = query(collection(db, 'chats'), where('userIds', '==', users));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  }
  const docRef = await addDoc(collection(db, 'chats'), {
    userIds: users,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Send a message to a chat
export const sendMessage = async (chatId, senderId, text) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  await addDoc(messagesRef, {
    senderId,
    text,
    timestamp: serverTimestamp(),
  });
};

// Listen for all messages in a chat (real-time)
export const subscribeToMessages = (chatId, callback) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
};

// Listen for all chats for a user (real-time, with last message and other user info)
export const subscribeToUserChats = (userId, callback) => {
  const q = query(collection(db, 'chats'), where('userIds', 'array-contains', userId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, async (snapshot) => {
    const chats = await Promise.all(snapshot.docs.map(async docSnap => {
      const chat = { id: docSnap.id, ...docSnap.data() };
      // Get last message
      const messagesRef = collection(db, 'chats', chat.id, 'messages');
      const lastMsgSnap = await getDocs(query(messagesRef, orderBy('timestamp', 'desc'), ));
      chat.lastMessage = lastMsgSnap.docs[0] ? { id: lastMsgSnap.docs[0].id, ...lastMsgSnap.docs[0].data() } : null;
      // Get the other user's profile
      const otherUserId = chat.userIds.find(id => id !== userId);
      chat.otherUser = await getUserProfile(otherUserId);
      return chat;
    }));
    callback(chats);
  });
};

// Delete a message from a chat
export const deleteMessage = async (chatId, messageId) => {
  const messageRef = doc(db, 'chats', chatId, 'messages', messageId);
  await deleteDoc(messageRef);
};

// Fetch a user profile by userId from roommateProfiles
export const getUserProfile = async (userId) => {
  const q = query(collection(db, 'roommateProfiles'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  }
  return null;
};

// --- COMMENT FUNCTIONS ---
// Add a comment to a listing (roommateProfiles, housingListings, messServices)
export const addCommentToListing = async (collectionName, listingId, userId, text) => {
  const commentsRef = collection(db, collectionName, listingId, 'comments');
  await addDoc(commentsRef, {
    userId,
    text,
    timestamp: serverTimestamp(),
  });
};
// Subscribe to comments for a listing (real-time)
export const subscribeToComments = (collectionName, listingId, callback) => {
  const commentsRef = collection(db, collectionName, listingId, 'comments');
  const q = query(commentsRef, orderBy('timestamp', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(comments);
  });
};
// Delete a comment from a listing
export const deleteComment = async (collectionName, listingId, commentId) => {
  const commentRef = doc(db, collectionName, listingId, 'comments', commentId);
  await deleteDoc(commentRef);
};

// Delete a mess by ID
export const deleteMess = async (id) => {
  // Delete from messServices
  const messServiceDocRef = doc(db, 'messServices', id);
  await deleteDoc(messServiceDocRef);

  // Delete from messRequests (if a request with the same id exists)
  const messRequestDocRef = doc(db, 'messRequests', id);
  try {
    await deleteDoc(messRequestDocRef);
  } catch (error) {
    // If not found, ignore error
  }
};

// Delete a housing listing by ID
export const deleteHousing = async (id) => {
  await deleteDoc(doc(db, 'housingListings', id));
};
// Delete a roommate profile by ID
export const deleteRoommate = async (id) => {
  await deleteDoc(doc(db, 'roommateProfiles', id));
};

export { onAuthStateChanged };