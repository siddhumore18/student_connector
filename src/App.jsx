import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Roommates from './pages/Roommates.jsx';
import Mess from './pages/Mess.jsx';
import Housing from './pages/Housing.jsx';
import Admin from './pages/Admin.jsx';
import Profile from './pages/Profile.jsx';
import AddMess from './pages/AddMess.jsx';
import AddHousing from './pages/AddHousing.jsx';
import AddRoommateProfile from './pages/AddRoommateProfile.jsx';
import MessDetails from './pages/MessDetails.jsx';


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
            <Route path="/mess/:id" element={<MessDetails />} />
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