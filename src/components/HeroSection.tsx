import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimationControls } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera, OrbitControls, RoundedBox } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

// Optimized Decorative MacBook Component - Reduced frequency animations
const DecorativeMacBook = () => {
  const laptopRef = useRef<THREE.Group>(null);
  const frameCounter = useRef(0);
  
  useFrame((state) => {
    // Only update every 4 frames for performance
    frameCounter.current++;
    if (frameCounter.current % 4 !== 0) return;
    
    if (laptopRef.current) {
      // Subtle floating animation
      laptopRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
      laptopRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
      <group 
        ref={laptopRef}
        position={[0, -2.5, -3]} 
        scale={[1.2, 1.2, 1.2]}
        rotation={[0, 0, 0]}
      >
        
        {/* MacBook Base */}
        <RoundedBox 
          args={[4, 0.2, 2.8]} 
          position={[0, -0.1, 0]}
          radius={0.12}
          smoothness={8}
        >
          <meshPhysicalMaterial 
            color="#e8e8e8"
            metalness={0.95}
            roughness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.03}
            reflectivity={0.9}
          />
        </RoundedBox>

        {/* Keyboard Area */}
        <RoundedBox
          args={[3.4, 0.02, 2.2]}
          position={[0, 0.02, 0.1]}
          radius={0.08}
          smoothness={4}
        >
          <meshPhysicalMaterial 
            color="#1a1a1a"
            metalness={0.1}
            roughness={0.8}
          />
        </RoundedBox>

        {/* Individual Keys Grid */}
        {Array.from({ length: 60 }, (_, i) => {
          const row = Math.floor(i / 12);
          const col = i % 12;
          const x = (col - 5.5) * 0.24;
          const z = (row - 2) * 0.24 + 0.1;
          
          return (
            <RoundedBox
              key={i}
              args={[0.2, 0.02, 0.18]}
              position={[x, 0.04, z]}
              radius={0.02}
              smoothness={2}
            >
              <meshPhysicalMaterial 
                color="#2a2a2a"
                metalness={0.05}
                roughness={0.9}
              />
            </RoundedBox>
          );
        })}

        {/* Trackpad */}
        <RoundedBox 
          args={[1.6, 0.005, 1.1]} 
          position={[0, 0.025, 0.85]}
          radius={0.08}
          smoothness={4}
        >
          <meshPhysicalMaterial 
            color="#3a3a3a"
            metalness={0.2}
            roughness={0.1}
          />
        </RoundedBox>

        {/* Screen Assembly */}
        <group position={[0, 0, -1.4]} rotation={[-0.1, 0, 0]}>
          {/* Screen Bezel */}
          <RoundedBox 
            args={[3.8, 2.4, 0.12]} 
            position={[0, 1.2, 0]}
            radius={0.1}
            smoothness={8}
          >
            <meshPhysicalMaterial 
              color="#e8e8e8"
              metalness={0.95}
              roughness={0.05}
              clearcoat={1}
              clearcoatRoughness={0.03}
              reflectivity={0.9}
            />
          </RoundedBox>
          
          {/* Screen Black Frame */}
          <RoundedBox
            args={[3.6, 2.25, 0.01]}
            position={[0, 1.2, 0.07]}
            radius={0.08}
            smoothness={4}
          >
            <meshBasicMaterial color="#000000" />
          </RoundedBox>
          
          {/* Screen Content - Subtle glow */}
          <mesh position={[0, 1.2, 0.08]}>
            <planeGeometry args={[3.4, 2.1]} />
            <meshBasicMaterial 
              color="#001122"
              transparent
              opacity={0.3}
            />
        </mesh>
        
          {/* Apple Logo */}
          <mesh position={[0, 2.0, -0.07]}>
            <circleGeometry args={[0.12]} />
            <meshBasicMaterial 
              color="#ffffff"
              transparent
              opacity={0.4}
            />
        </mesh>
        
          {/* Subtle Screen Glow */}
          <mesh position={[0, 1.2, 0.1]}>
            <planeGeometry args={[4.2, 2.8]} />
          <meshBasicMaterial 
              color="#0099ff" 
            transparent 
              opacity={0.05} 
              side={THREE.DoubleSide}
          />
        </mesh>
        </group>
      </group>
    </Float>
  );
};

// Optimized Particles - Reduced rotation frequency
const EnhancedParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const frameCounter = useRef(0);
  const particlesCount = 200;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    
    // Random colors
    const colorIndex = Math.random();
    if (colorIndex < 0.33) {
      colors[i * 3] = 0.0; colors[i * 3 + 1] = 0.6; colors[i * 3 + 2] = 1.0; // Blue
    } else if (colorIndex < 0.66) {
      colors[i * 3] = 0.5; colors[i * 3 + 1] = 0.0; colors[i * 3 + 2] = 1.0; // Purple
    } else {
      colors[i * 3] = 0.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 0.6; // Cyan
    }
  }

  useFrame((state) => {
    // Only update every 6 frames for performance
    frameCounter.current++;
    if (frameCounter.current % 6 !== 0) return;
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particlesCount}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.08} 
        sizeAttenuation 
        vertexColors
        transparent
        opacity={0.8}
      />
    </points>
  );
};

interface HeroSectionProps {
  onContactClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onContactClick }) => {
  const navigate = useNavigate();
  
  const handleEnterGame = () => {
    navigate('/game');
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimationControls();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.5,
        staggerChildren: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 80, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const nameVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.5,
      rotateX: -90,
      y: 100
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      y: 0,
      transition: {
        duration: 2,
        ease: "easeOut",
        type: "spring",
        stiffness: 80,
      },
    },
  };

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-black to-slate-800"
      id="hero"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-30">
        <motion.div 
          className="w-full h-full"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
      }} />

      {/* 3D Canvas - Decorative MacBook in Background */}
      <div className="absolute inset-0 w-full h-full">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 4}
            autoRotate
            autoRotateSpeed={0.3}
          />
          
          {/* Enhanced Lighting Setup */}
          <ambientLight intensity={0.3} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            color="#ffffff"
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[0, 5, 0]} intensity={0.8} color="#0099ff" />
          <pointLight position={[-10, -5, -10]} intensity={0.5} color="#8b5cf6" />
          <pointLight position={[10, -5, -10]} intensity={0.5} color="#06d6a0" />
          
          {/* Rim lighting */}
          <directionalLight 
            position={[-5, 0, -5]} 
            intensity={0.3} 
            color="#00ffff" 
          />
          
          {/* 3D Objects */}
          <DecorativeMacBook />
          <EnhancedParticles />
          
          {/* Environment with HDR */}
          <Environment preset="studio" />
          
          {/* Fog for depth */}
          <fog attach="fog" args={['#000000', 8, 30]} />
        </Canvas>
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Ultra-Dramatic Name Display */}
        <motion.div variants={nameVariants} className="mb-8">
          <motion.h1 
            className="relative text-6xl md:text-8xl lg:text-9xl font-black tracking-wider mb-6"
            style={{
              background: "linear-gradient(45deg, #ffffff, #00b4d8, #0077b6, #ffffff)",
              backgroundSize: "400% 400%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 30px rgba(0, 180, 216, 0.5))",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{ 
              scale: 1.05,
              filter: "drop-shadow(0 0 50px rgba(0, 180, 216, 0.8))",
            }}
          >
            BENIAMIN
            
            {/* Glowing outline */}
            <motion.div
              className="absolute inset-0 text-6xl md:text-8xl lg:text-9xl font-black tracking-wider"
              style={{
                WebkitTextStroke: "2px rgba(0, 180, 216, 0.3)",
                WebkitTextFillColor: "transparent",
                zIndex: -1,
              }}
              animate={{
                WebkitTextStroke: [
                  "2px rgba(0, 180, 216, 0.3)",
                  "2px rgba(0, 180, 216, 0.8)",
                  "2px rgba(0, 180, 216, 0.3)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              BENIAMIN
            </motion.div>
          </motion.h1>
          
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 1.5, type: "spring" }}
          >
            <motion.p 
              className="text-3xl md:text-5xl font-light tracking-widest text-cyan-300"
              style={{
                textShadow: "0 0 20px rgba(6, 182, 212, 0.6), 0 0 40px rgba(6, 182, 212, 0.4)",
              }}
              animate={{
                textShadow: [
                  "0 0 20px rgba(6, 182, 212, 0.6), 0 0 40px rgba(6, 182, 212, 0.4)",
                  "0 0 30px rgba(6, 182, 212, 0.9), 0 0 60px rgba(6, 182, 212, 0.6)",
                  "0 0 20px rgba(6, 182, 212, 0.6), 0 0 40px rgba(6, 182, 212, 0.4)",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
          >
            DUMITRIU
          </motion.p>
            
            {/* Underline effect */}
            <motion.div
              className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-4"
              initial={{ width: 0 }}
              animate={{ width: "70%" }}
              transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
            />
          </motion.div>
        </motion.div>

        {/* Enhanced Subtitle */}
        <motion.div variants={itemVariants} className="mb-16">
          <motion.div 
            className="inline-block px-8 py-4 rounded-2xl border-2 border-blue-400/30 backdrop-blur-xl"
            style={{
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))",
              boxShadow: "0 8px 32px rgba(59, 130, 246, 0.2)",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 12px 40px rgba(59, 130, 246, 0.4)",
              borderColor: "rgba(59, 130, 246, 0.6)",
            }}
          >
            <p className="text-xl md:text-2xl text-blue-300 font-mono font-medium">
              Full Stack Developer & UI/UX Enthusiast
            </p>
          </motion.div>
        </motion.div>

        {/* Enhanced Interactive Buttons */}
        <motion.div variants={itemVariants} className="mb-20 flex flex-wrap justify-center gap-6">
          {onContactClick && (
            <motion.button
              className="group relative px-10 py-5 rounded-2xl border-2 border-emerald-400/50 backdrop-blur-xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))",
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 15px 50px rgba(16, 185, 129, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onContactClick}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <div className="relative flex items-center space-x-4">
                <motion.div 
                  className="w-4 h-4 bg-emerald-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-white font-mono text-lg font-medium">📧 Contact Me</span>
                <motion.svg 
                  className="w-6 h-6 text-emerald-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </motion.svg>
              </div>
            </motion.button>
          )}
          
          <motion.button
            className="group relative px-10 py-5 rounded-2xl border-2 border-purple-400/50 backdrop-blur-xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1))",
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 15px 50px rgba(139, 92, 246, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-violet-400/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
            <div className="relative flex items-center space-x-4">
              <motion.div 
                className="w-4 h-4 bg-purple-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
              <span className="text-white font-mono text-lg font-medium">Explore Traditional CV</span>
              <motion.svg 
                className="w-6 h-6 text-purple-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                whileHover={{ y: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </motion.svg>
            </div>
          </motion.button>
          
          <motion.button
            className="group relative px-10 py-5 rounded-2xl border-2 border-cyan-400/50 backdrop-blur-xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(8, 145, 178, 0.1))",
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 15px 50px rgba(6, 182, 212, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnterGame}
          >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <div className="relative flex items-center space-x-4">
            <motion.div 
                  className="w-4 h-4 bg-cyan-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                <span className="text-white font-mono text-lg font-medium">🎮 Enter 3D CV World</span>
                <motion.svg 
                  className="w-6 h-6 text-cyan-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ rotate: 45, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </motion.svg>
              </div>
            </motion.button>
        </motion.div>

        {/* Enhanced Tech Stack */}
        <motion.div variants={itemVariants} className="mb-16">
          <motion.h3 
            className="text-2xl font-mono text-gray-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            Tech Arsenal
          </motion.h3>
          <div className="flex flex-wrap justify-center gap-4">
          {[
              { name: 'React', color: '#61DAFB', icon: '⚛️' },
              { name: 'TypeScript', color: '#3178C6', icon: '🔷' },
              { name: 'Node.js', color: '#339933', icon: '🟢' },
              { name: 'Python', color: '#3776AB', icon: '🐍' },
              { name: 'Three.js', color: '#000000', icon: '🎮' },
              { name: 'Next.js', color: '#000000', icon: '▲' }
          ].map((tech, index) => (
            <motion.div
              key={tech.name}
                className="group relative px-6 py-3 rounded-xl backdrop-blur-xl border border-gray-600/30 overflow-hidden"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 2.5 + index * 0.1, 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 200 
                }}
              whileHover={{ 
                  scale: 1.15, 
                  boxShadow: `0 10px 30px ${tech.color}40`,
                  borderColor: tech.color,
              }}
            >
                <motion.div
                  className="absolute inset-0 opacity-20"
                  style={{ backgroundColor: tech.color }}
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative flex items-center space-x-2">
                  <span className="text-xl">{tech.icon}</span>
                  <span className="text-gray-300 font-mono font-medium">{tech.name}</span>
                </div>
            </motion.div>
          ))}
          </div>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          className="absolute -bottom-20 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4, duration: 1.5 }}
        >
          <motion.div
            className="flex flex-col items-center text-gray-400 cursor-pointer"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.1, color: "#06d6a0" }}
          >
            <span className="text-sm font-mono mb-3 tracking-wider">Discover More</span>
            <motion.div
              className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
              whileHover={{ borderColor: "#06d6a0" }}
            >
              <motion.div
                className="w-1 h-3 bg-gray-400 rounded-full mt-2"
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection; 