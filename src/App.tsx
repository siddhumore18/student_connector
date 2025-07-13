import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Roommates from './pages/Roommates';
import Mess from './pages/Mess';
import Housing from './pages/Housing';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import AddMess from './pages/AddMess';
import AddHousing from './pages/AddHousing';
import AddRoommateProfile from './pages/AddRoommateProfile';

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Home />} />
            <Route path="/roommates" element={<Roommates />} />
            <Route path="/mess" element={<Mess />} />
            <Route path="/housing" element={<Housing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-mess" element={<AddMess />} />
            <Route path="/add-housing" element={<AddHousing />} />
            <Route path="/add-roommate-profile" element={<AddRoommateProfile />} />
            
            {/* Admin only routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;