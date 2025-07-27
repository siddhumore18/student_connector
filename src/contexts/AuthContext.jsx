import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, signInWithGoogle, logOut, onAuthStateChanged } from '../services/firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const adminEmails = ['admin@campus.com', 'admin@connector.com'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const isAdmin = adminEmails.includes(firebaseUser.email || '');
        const userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'User',
          role: isAdmin ? 'admin' : 'user',
          avatar: firebaseUser.photoURL || undefined
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Successfully signed in!');
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;
      const isAdmin = adminEmails.includes(firebaseUser.email || '');
      const userData = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'User',
        role: isAdmin ? 'admin' : 'user',
        avatar: firebaseUser.photoURL || undefined
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Signed in successfully!');
    } catch (error) {
      console.error('Email sign in error:', error);
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setUser(null);
      localStorage.removeItem('user');
      toast.success('Successfully logged out!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const value = {
    user,
    signInWithGoogle: handleGoogleSignIn,
    signInWithEmail,
    logout: handleLogout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
