import React, { useRef, useEffect } from 'react';
import { motion, useInView, useAnimationControls } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 3D Laptop Component
const Laptop3D = () => {
  const laptopRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (laptopRef.current) {
      laptopRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      laptopRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={laptopRef} position={[0, -0.5, 0]}>
        {/* Laptop Base */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[3, 0.2, 2]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Laptop Screen */}
        <mesh position={[0, 0.8, -0.9]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[2.8, 1.8, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Screen Content */}
        <mesh position={[0, 0.8, -0.85]} rotation={[-0.1, 0, 0]}>
          <planeGeometry args={[2.6, 1.6]} />
          <meshBasicMaterial color="#000" />
        </mesh>
        
        {/* Screen Glow */}
        <mesh position={[0, 0.8, -0.84]} rotation={[-0.1, 0, 0]}>
          <planeGeometry args={[2.4, 1.4]} />
          <meshBasicMaterial 
            color="#00f3ff" 
            opacity={0.3} 
            transparent 
          />
        </mesh>
      </group>
    </Float>
  );
};

// Floating Particles
const Particles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const particlesCount = 100;
  const positions = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.02;
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
      </bufferGeometry>
      <pointsMaterial color="#3b82f6" size={0.05} sizeAttenuation />
    </points>
  );
};

interface HeroSectionProps {
  onEnterGame?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onEnterGame }) => {
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
        duration: 1,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800"
      id="hero"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 w-full h-full">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} />
          
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
          
          {/* 3D Objects */}
          <Laptop3D />
          <Particles />
          
          {/* Environment */}
          <Environment preset="night" />
        </Canvas>
      </div>

      {/* Content Overlay */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Main Heading */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.h1 
            className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 text-3d mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            BENIAMIN
          </motion.h1>
          <motion.p 
            className="text-2xl md:text-4xl text-gray-300 font-mono neon-glow"
            style={{ color: '#00f3ff' }}
          >
            DUMITRIU
          </motion.p>
        </motion.div>

        {/* Subtitle */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="inline-block px-6 py-3 glass rounded-full border border-blue-500/30">
            <p className="text-lg md:text-xl text-blue-400 font-mono">
              Full Stack Developer & UI/UX Enthusiast
            </p>
          </div>
        </motion.div>

        {/* Interactive Elements */}
        <motion.div variants={itemVariants} className="mb-16 space-x-6 space-y-6">
          <motion.div 
            className="inline-flex items-center space-x-4 glass px-8 py-4 rounded-full border border-purple-500/30 cursor-pointer"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-white font-mono">Explore Traditional CV</span>
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
          
          {onEnterGame && (
            <motion.div 
              className="inline-flex items-center space-x-4 glass px-8 py-4 rounded-full border border-cyan-500/30 cursor-pointer"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6, 182, 212, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onEnterGame}
            >
              <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
              <span className="text-white font-mono">🎮 Enter 3D CV World</span>
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </motion.div>
          )}
        </motion.div>

        {/* Tech Stack Showcase */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
          {[
            { name: 'React', color: '#61DAFB' },
            { name: 'TypeScript', color: '#3178C6' },
            { name: 'Node.js', color: '#339933' },
            { name: 'Python', color: '#3776AB' },
            { name: 'Three.js', color: '#000000' },
            { name: 'Next.js', color: '#000000' }
          ].map((tech, index) => (
            <motion.div
              key={tech.name}
              className="px-4 py-2 glass rounded-lg border border-gray-600/30"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2 + index * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.1, 
                boxShadow: `0 0 20px ${tech.color}40` 
              }}
            >
              <span className="text-gray-300 font-mono text-sm">{tech.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute -bottom-24 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 1 }}
        >
          <motion.div
            className="flex flex-col items-center text-gray-400"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-sm font-mono mb-2">Scroll to explore</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection; 