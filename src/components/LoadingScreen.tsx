import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing 3D Environment...');

  useEffect(() => {
    const loadingStages = [
      'Initializing 3D Environment...',
      'Loading Assets...',
      'Calibrating Camera...',
      'Preparing Interactive Elements...',
      'Optimizing Performance...',
      'Welcome to Beniamin\'s CV!'
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15 + 5;
        
        // Update loading text based on progress
        const stageIndex = Math.floor((newProgress / 100) * loadingStages.length);
        if (stageIndex < loadingStages.length) {
          setLoadingText(loadingStages[stageIndex]);
        }

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => onLoadingComplete(), 1000);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center">
        {/* Logo/Name Animation */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0, rotateY: -180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ duration: 1.2, ease: "backOut" }}
        >
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 text-3d">
            BENIAMIN
          </h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mt-2 font-mono"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Full Stack Developer
          </motion.p>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-80 md:w-96 mx-auto mb-6">
          <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
            {/* Glow Effect */}
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-sm opacity-60"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          
          {/* Progress Text */}
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>{Math.round(progress)}%</span>
            <span className="font-mono">Loading...</span>
          </div>
        </div>

        {/* Loading Text */}
        <motion.p
          key={loadingText}
          className="text-gray-300 font-mono text-sm md:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {loadingText}
        </motion.p>

        {/* Loading Dots Animation */}
        <div className="mt-8 flex justify-center">
          <div className="loading-dots">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        {/* Tech Stack Preview */}
        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          {['React', 'TypeScript', 'Three.js', 'Node.js', 'Python'].map((tech, index) => (
            <motion.span
              key={tech}
              className="px-3 py-1 text-xs bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-full text-gray-300"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 + index * 0.1, duration: 0.5 }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Corner Elements */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-blue-500"></div>
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-purple-500"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-cyan-500"></div>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-pink-500"></div>
    </motion.div>
  );
};

export default LoadingScreen; 