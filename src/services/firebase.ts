import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, where, orderBy, updateDoc, doc, getDocs } from 'firebase/firestore';
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
export const analytics = getAnalytics(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);

// Firestore functions
export const addMessRequest = async (messData: any) => {
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

export const addHousingRequest = async (housingData: any) => {
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

export const approveMessRequest = async (requestId: string, requestData: any) => {
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
  } catch (error) {
    console.error('Error approving mess request:', error);
    throw error;
  }
};

export const approveHousingRequest = async (requestId: string, requestData: any) => {
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

export const rejectRequest = async (collection: string, requestId: string) => {
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
export const subscribeToMessRequests = (callback: (requests: any[]) => void) => {
  const q = query(collection(db, 'messRequests'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(requests);
  });
};

export const subscribeToHousingRequests = (callback: (requests: any[]) => void) => {
  const q = query(collection(db, 'housingRequests'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(requests);
  });
};

export const subscribeToMessServices = (callback: (services: any[]) => void) => {
  const q = query(collection(db, 'messServices'), where('active', '==', true), orderBy('approvedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(services);
  });
};

export const subscribeToHousingListings = (callback: (listings: any[]) => void) => {
  const q = query(collection(db, 'housingListings'), where('available', '==', true), orderBy('approvedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const listings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(listings);
  });
};

export { onAuthStateChanged };