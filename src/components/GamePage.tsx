import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import GameWorld from './GameWorld';

const GamePage: React.FC = () => {
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
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    };
  }, []);

  const handleBackToHome = () => {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
    
    setTimeout(() => {
      navigate('/');
    }, 100);
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Back Button */}
      <button
        onClick={handleBackToHome}
        className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-black/70 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Portfolio</span>
      </button>

      {/* Game World Component */}
      <GameWorld />
    </div>
  );
};

export default GamePage; 