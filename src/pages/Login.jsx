import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { signInWithGoogle, signInWithEmail, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [manualLoading, setManualLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      toast.error('Google sign-in failed');
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      setManualLoading(true);
      await signInWithEmail(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error('Invalid email or password');
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your CampusConnect account</p>
        </div>

        {/* Admin Info */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Admin Access:</h3>
          <p className="text-sm text-blue-700">
            Use admin@campus.com or admin@connector.com email to get admin privileges
          </p>
        </div>

        {/* Email/Password Login */}
        <form onSubmit={handleEmailSignIn} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sign in with Email</h3>
            <p className="text-gray-600 mb-6">Use your credentials to login manually</p>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={manualLoading}
              className="w-full px-4 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {manualLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* OR Divider */}
        <div className="flex items-center justify-center space-x-2 text-gray-500 font-medium">
          <span className="border-t border-gray-300 w-1/5" />
          <span className="text-sm">OR</span>
          <span className="border-t border-gray-300 w-1/5" />
        </div>

        {/* Google Sign-In */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sign in with Google</h3>
            <p className="text-gray-600 mb-6">Use your Google account to access CampusConnect</p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-2"></div>
                Signing In...
              </>
            ) : (
              <>
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5 mr-3" />
                Sign in with Google
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
