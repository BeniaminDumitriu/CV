import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPortfolio from './components/MainPortfolio';
import GamePage from './components/GamePage';
import ContactPage from './components/ContactPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Main Portfolio Route */}
      <Route path="/" element={<MainPortfolio />} />
      
      {/* Game Page - Separate route for 3D Game */}
      <Route path="/game" element={<GamePage />} />
      
      {/* Contact Page */}
      <Route path="/contact" element={<ContactPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
