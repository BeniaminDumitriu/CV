import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Home, 
  User, 
  Code, 
  FolderOpen, 
  Gamepad2, 
  Mail, 
  Phone, 
  ArrowLeft,
  MousePointer,
  Keyboard,
  Sparkles
} from 'lucide-react';
import LoadingScreen from './components/LoadingScreen';
import HeroSection from './components/HeroSection';
import GameWorld from './components/GameWorld';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import CVRoom3D from './components/CVRoom3D';
import ContactPage from './components/ContactPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('hero');
  const [currentView, setCurrentView] = useState<'cv' | 'game'>('cv');
  const navigate = useNavigate();

  // Global cleanup for pointer lock
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && document.pointerLockElement) {
        document.exitPointerLock();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Final cleanup
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    };
  }, []);

  // Handle loading completion
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleEnterGame = () => {
    // Cleanup any existing pointer lock before entering game
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
    setCurrentSection('game');
  };

  const handleBackToSite = () => {
    // Exit pointer lock before changing sections
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
    
    // Add a small delay to ensure pointer lock is properly released
    setTimeout(() => {
      setCurrentSection('hero');
    }, 100);
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <Routes>
      {/* Home Route */}
      <Route path="/" element={
        <div className="App">
          <div className="hero-overlay">
            <HeroSection onContactClick={handleContactClick} />
          </div>
          
          <div className="view-toggle">
            <button 
              className={currentView === 'cv' ? 'active' : ''}
              onClick={() => setCurrentView('cv')}
            >
              3D CV
            </button>
            <button 
              className={currentView === 'game' ? 'active' : ''}
              onClick={() => setCurrentView('game')}
            >
              Game World
            </button>
          </div>

          {currentView === 'cv' ? <CVRoom3D /> : <GameWorld />}
        </div>
      } />
      
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
