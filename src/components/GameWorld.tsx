import React, { useRef, useState, useEffect, createContext, useContext } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Environment, 
  Html
} from '@react-three/drei';
import * as THREE from 'three';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { usePreventScroll } from '../hooks/usePreventScroll';
import { motion } from 'framer-motion';
import { useSpring, a as three } from '@react-spring/three';
import { DirectionalLight } from './DirectionalLight';
import MobileCameraControl from './MobileCameraControl';
import MobileUI from './MobileUI';

// Robust Pointer Lock Controls with fixed diagonal movement
const RobustPointerLockControls: React.FC = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);
  const [isLocked, setIsLocked] = useState(false);
  const mouseSensitivity = 0.002;
  
  // Store rotation values to avoid gimbal lock
  const rotation = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const canvas = gl.domElement;
    
    // Initialize rotation from camera
    rotation.current.x = camera.rotation.x;
    rotation.current.y = camera.rotation.y;
    
    // Manual pointer lock implementation with better error handling
    const handleCanvasClick = async () => {
      if (document.pointerLockElement !== canvas) {
        try {
          await canvas.requestPointerLock();
        } catch (error) {
          // Silent fail - user will need to click again
        }
      }
    };

    const handlePointerLockChange = () => {
      const locked = document.pointerLockElement === canvas;
      setIsLocked(locked);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return;

      const deltaX = event.movementX * mouseSensitivity;
      const deltaY = event.movementY * mouseSensitivity;

      // Update stored rotation values
      rotation.current.y -= deltaX;
      rotation.current.x -= deltaY;

      // Clamp vertical rotation to prevent flipping
      rotation.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.current.x));

      // Apply rotation in correct order to avoid gimbal lock
      camera.rotation.order = 'YXZ';
      camera.rotation.y = rotation.current.y;
      camera.rotation.x = rotation.current.x;
      camera.rotation.z = 0; // Prevent roll
    };

    // Add event listeners
    canvas.addEventListener('click', handleCanvasClick);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('mousemove', handleMouseMove);
      
      // Safe cleanup
      try {
        if (document.pointerLockElement === canvas) {
          document.exitPointerLock();
        }
      } catch (error) {
        // Silent cleanup failure
      }
    };
  }, [camera, gl]);

  return null;
};

// Interaction Context
const InteractionContext = createContext<{
  interactions: {
    laptopOpen: boolean;
    whiteboardOpen: boolean;
    monitorOpen: boolean;
    trophyOpen: boolean;
    notebookOpen: boolean;
    phoneOpen: boolean;
  };
  toggleInteraction: (id: string) => void;
} | null>(null);

const InteractionProvider = ({ children }: { children: React.ReactNode }) => {
  const [interactions, setInteractions] = useState({
    laptopOpen: false,
    whiteboardOpen: false,
    monitorOpen: false,
    trophyOpen: false,
    notebookOpen: false,
    phoneOpen: false,
  });
  
  const toggleInteraction = (id: string) => {
    try {
      console.log('🔄 Toggling interaction:', id);
      setInteractions(prev => {
        const newState = {
          ...prev,
          [`${id}Open`]: !prev[`${id}Open` as keyof typeof prev]
        };
        console.log('✅ New interaction state:', newState);
        return newState;
      });
    } catch (error) {
      console.error('❌ Error in toggleInteraction:', error);
    }
  };
  
  return (
    <InteractionContext.Provider value={{ interactions, toggleInteraction }}>
      {children}
    </InteractionContext.Provider>
  );
};

const useInteractions = () => {
  const context = useContext(InteractionContext);
  if (!context) throw new Error('useInteractions must be used within InteractionProvider');
  return context;
};

// Interactive Laptop Component - Static for performance
const InteractiveLaptop3D = ({ position }: { position: [number, number, number] }) => {
  const laptopRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { interactions } = useInteractions();
  
  const open = interactions.laptopOpen;
  
  const { openValue } = useSpring({ 
    openValue: open ? 1 : 0,
    config: { tension: 280, friction: 60 }
  });
  
  // NO useFrame - static for performance

  return (
    <group 
      ref={laptopRef} 
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Laptop Base/Keyboard - Ultra detail */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.05, 0.6]} />
        <meshStandardMaterial 
          color={hovered ? "#3A3A3A" : "#2C2C2C"} 
          metalness={0.95} 
          roughness={0.02}
          envMapIntensity={2.0}
          transparent={false}
          normalScale={[1, 1]}
        />
      </mesh>
      
      {/* Keyboard Keys for detail */}
      {Array.from({ length: 48 }, (_, i) => {
        const row = Math.floor(i / 12);
        const col = i % 12;
        const x = (col - 5.5) * 0.06;
        const z = (row - 1.5) * 0.08;
        return (
          <mesh 
            key={i} 
            position={[x, 0.03, z]} 
            castShadow
          >
            <boxGeometry args={[0.05, 0.02, 0.06]} />
            <meshStandardMaterial 
              color="#1A1A1A"
              metalness={0.1}
              roughness={0.9}
            />
          </mesh>
        );
      })}
      
      {/* Trackpad */}
      <mesh position={[0, 0.03, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.01, 0.15]} />
        <meshStandardMaterial 
          color="#0A0A0A"
          metalness={0.8}
          roughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>
      
      {/* Clean Laptop with Base - No Keys */}
      
      {/* Laptop Screen - Animated Opening */}
      <three.group 
        rotation-x={openValue.to([0, 1], [1.5, -0.3])}
        position={[0, 0.025, -0.25]}
      >
        {/* Screen Frame - Ultra Enhanced */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.75, 0.5, 0.04]} />
          <meshStandardMaterial 
            color="#1A1A1A" 
            metalness={0.95} 
            roughness={0.05}
            envMapIntensity={2.0}
          />
        </mesh>
        
        {/* Screen Display - Ultra Enhanced */}
        <mesh position={[0, 0.35, 0.021]}>
          <boxGeometry args={[0.68, 0.43, 0.005]} />
          <meshStandardMaterial 
            color="#000000" 
            emissive={open ? "#002244" : "#000000"}
            emissiveIntensity={open ? 0.8 : 0.05}
            metalness={0.05}
            roughness={0.05}
            transparent={true}
            opacity={0.95}
          />
        </mesh>
        
        {/* Screen Bezel Details */}
        <mesh position={[0, 0.35, 0.025]}>
          <boxGeometry args={[0.72, 0.47, 0.002]} />
          <meshStandardMaterial 
            color="#333333" 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
        
        {/* Apple Logo (enhanced) */}
        <mesh position={[0, 0.35, -0.021]}>
          <cylinderGeometry args={[0.05, 0.05, 0.001]} />
          <meshStandardMaterial 
            color="#FFFFFF" 
            emissive="#FFFFFF"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </three.group>
      
      {/* CV Content on SCREEN when open */}
      {open && (
        <Html 
          position={[0, 0.38, -0.23]} 
          rotation={[-0.3, 0, 0]} 
          transform
          distanceFactor={1.5}
          sprite
        >
          <div style={{
            width: '840px',
            height: '540px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '24px',
            padding: '60px',
            fontSize: '33px',
            color: 'white',
            textAlign: 'center',
            border: '9px solid #FFD700',
            boxShadow: '0 0 75px rgba(255, 215, 0, 0.4)',
            imageRendering: 'crisp-edges',
            WebkitFontSmoothing: 'antialiased',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <h3 style={{margin: '0 0 36px 0', fontSize: '48px', color: '#FFD700', fontWeight: 'bold'}}>💻 Beniamin Dumitriu</h3>
            <p style={{margin: '0 0 24px 0', fontSize: '36px', fontWeight: 'normal'}}>Junior Web Developer</p>
            <p style={{margin: '0', fontSize: '30px', opacity: 0.9, lineHeight: '1.4'}}>Passionate about creating amazing digital experiences!</p>
            <div style={{marginTop: '36px', fontSize: '27px', opacity: 0.8}}>
              <p style={{margin: '12px 0'}}>🚀 React • Three.js • TypeScript</p>
              <p style={{margin: '0'}}>✨ Building the future, one pixel at a time</p>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Modern Wall-Mounted Whiteboard
const InteractiveWhiteboard = ({ position }: { position: [number, number, number] }) => {
  const { interactions } = useInteractions();
  const showContent = interactions.whiteboardOpen;
  
  return (
    <group position={position}>
      {/* Wall Mount Frame */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[0.05, 4.2, 6.2]} />
        <meshStandardMaterial color="#2C2C2C" metalness={0.8} />
      </mesh>
      
      {/* Whiteboard Surface */}
      <mesh>
        <boxGeometry args={[0.03, 4, 6]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.1} />
      </mesh>
      
      {/* Marker Tray */}
      <mesh position={[0, -2.2, 0]}>
        <boxGeometry args={[0.1, 0.2, 6]} />
        <meshStandardMaterial color="#2C2C2C" />
      </mesh>
      
      {showContent && (
        <Html position={[0.1, 0, 0]} transform>
          <div style={{
            background: 'rgba(255,255,255,0.98)',
            padding: '20px',
            borderRadius: '8px',
            fontSize: '11px',
            color: 'black',
            width: '320px',
            height: '220px',
            overflow: 'auto',
            border: '3px solid #00ff88',
            boxShadow: '0 0 30px rgba(0,255,136,0.3)'
          }}>
            <h3 style={{color: '#2C2C2C', margin: '0 0 12px 0', textAlign: 'center'}}>🛠️ Technical Skills Arsenal</h3>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '9px'}}>
              <div style={{background: '#f0f8ff', padding: '8px', borderRadius: '5px'}}>
                <strong>💻 Languages:</strong><br/>
                • C/C++, Python, Java<br/>
                • JavaScript, TypeScript<br/>
                • Kotlin, C#
              </div>
              <div style={{background: '#f0fff0', padding: '8px', borderRadius: '5px'}}>
                <strong>🚀 Frameworks:</strong><br/>
                • React, Svelte<br/>
                • NestJs, Tailwind<br/>
                • HTML, CSS
              </div>
            </div>
            <div style={{marginTop: '12px', fontSize: '9px', background: '#fff5ee', padding: '8px', borderRadius: '5px'}}>
              <strong>🔧 Tools & Technologies:</strong><br/>
              GitHub, BitBucket, Eclipse, SQL, OOP, Android Studio
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Modern Wall-Mounted Monitor
const InteractiveMonitor = ({ position }: { position: [number, number, number] }) => {
  const { interactions } = useInteractions();
  const showEducation = interactions.monitorOpen;
  
  return (
    <group position={position}>
      {/* Wall Mount Arm */}
      <mesh position={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6]} />
        <meshStandardMaterial color="#2C2C2C" metalness={0.8} />
      </mesh>
      
      {/* Monitor Frame */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.15, 3.2, 4.2]} />
        <meshStandardMaterial color="#1A1A1A" metalness={0.9} />
      </mesh>
      
      {/* Monitor Screen */}
      <mesh>
        <boxGeometry args={[0.05, 3, 4]} />
        <meshStandardMaterial 
          color="#000000" 
          emissive={showEducation ? "#003300" : "#000000"} 
          emissiveIntensity={showEducation ? 0.4 : 0.1}
        />
      </mesh>
      
      {showEducation && (
        <Html position={[0.1, 0, 0]} transform>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px',
            borderRadius: '8px',
            fontSize: '11px',
            color: 'white',
            width: '280px',
            border: '3px solid #FFD700',
            boxShadow: '0 0 25px rgba(255, 215, 0, 0.4)'
          }}>
            <h3 style={{margin: '0 0 12px 0', color: '#FFD700', textAlign: 'center'}}>🎓 Educational Journey</h3>
            <div style={{fontSize: '9px', lineHeight: '1.4', background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '5px'}}>
              <p style={{marginBottom: '8px'}}><strong>🏛️ Stefan cel Mare University</strong><br/>Computer Science (2020-2024)</p>
              <p style={{marginBottom: '8px'}}><strong>🎯 M Eminescu College</strong><br/>Mathematics/Informatics (2016-2020)</p>
              <div style={{background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '4px'}}>
                <strong>🌍 Languages:</strong><br/>
                🇷🇴 Romanian (Native)<br/>
                🇺🇸 English (Advanced)
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Modern Side Table for Notebook
const ModernSideTable = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Table Top - Moved higher */}
    <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[1, 1, 0.08]} />
      <meshStandardMaterial color="#4A3426" metalness={0.3} roughness={0.2} />
    </mesh>
    
    {/* Central Support Post - Higher */}
    <mesh position={[0, 0.6, 0]} castShadow>
      <cylinderGeometry args={[0.06, 0.06, 1.2]} />
      <meshStandardMaterial color="#2C2C2C" metalness={0.8} roughness={0.2} />
    </mesh>
    
    {/* Rectangular Base for Support */}
    <mesh position={[0, 0, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.4, 0.1, 1.4]} />
      <meshStandardMaterial color="#3A2B1A" roughness={0.4} />
    </mesh>
  </group>
);

// Modern Shelf with Floor Support
const ModernShelf = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Shelf Surface */}
    <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
      <boxGeometry args={[2, 0.1, 0.8]} />
      <meshStandardMaterial color="#8B4513" roughness={0.3} metalness={0.1} />
    </mesh>
    
    {/* Support Legs to Floor */}
    <mesh position={[-0.8, -0.45, 0]} castShadow>
      <cylinderGeometry args={[0.04, 0.04, 1]} />
      <meshStandardMaterial color="#2C2C2C" metalness={0.8} />
    </mesh>
    <mesh position={[0.8, -0.45, 0]} castShadow>
      <cylinderGeometry args={[0.04, 0.04, 1]} />
      <meshStandardMaterial color="#2C2C2C" metalness={0.8} />
    </mesh>
    
    {/* Floor Base */}
    <mesh position={[0, -0.95, 0]} receiveShadow>
      <boxGeometry args={[2.2, 0.1, 1]} />
      <meshStandardMaterial color="#2C2C2C" metalness={0.6} roughness={0.3} />
    </mesh>
  </group>
);

// Trophy Display Case
const TrophyDisplayCase = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Glass Case */}
    <mesh position={[0, 1, 0]}>
      <boxGeometry args={[1.5, 2, 1.5]} />
      <meshStandardMaterial 
        color="#ffffff" 
        transparent 
        opacity={0.3} 
        roughness={0.1}
        metalness={0.1}
      />
    </mesh>
    
    {/* Base */}
    <mesh position={[0, -0.1, 0]}>
      <boxGeometry args={[1.7, 0.2, 1.7]} />
      <meshStandardMaterial color="#2C2C2C" metalness={0.8} />
    </mesh>
    
    {/* Simple Light */}
    <pointLight 
      position={[0, 2.2, 0]} 
      intensity={1}
      color="#FFD700"
      distance={6}
    />
  </group>
);

// Interactive Trophy - Pure CSS animations
const InteractiveTrophy = ({ position }: { position: [number, number, number] }) => {
  const trophyRef = useRef<THREE.Group>(null);
  const { interactions } = useInteractions();
  const showAchievements = interactions.trophyOpen;
  
  // NO useFrame - using CSS animations for performance
  
  return (
    <group ref={trophyRef} position={position}>
      {/* Trophy Cup - Enhanced */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.5, 0.8]} />
        <meshStandardMaterial 
          color="#FFD700" 
          metalness={0.95} 
          roughness={0.05}
          envMapIntensity={2.0}
        />
      </mesh>
      
      {/* Trophy Handles - Enhanced */}
      <mesh position={[-0.4, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <torusGeometry args={[0.15, 0.03]} />
        <meshStandardMaterial 
          color="#FFD700" 
          metalness={0.95} 
          roughness={0.05}
          envMapIntensity={2.0}
        />
      </mesh>
      <mesh position={[0.4, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <torusGeometry args={[0.15, 0.03]} />
        <meshStandardMaterial 
          color="#FFD700" 
          metalness={0.95} 
          roughness={0.05}
          envMapIntensity={2.0}
        />
      </mesh>
      
      {/* Trophy Base - Enhanced */}
      <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.8} 
          metalness={0.05}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {showAchievements && (
        <Html position={[0, 1.5, 0]} transform>
          <div style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            padding: '18px',
            borderRadius: '10px',
            fontSize: '10px',
            color: 'black',
            width: '250px',
            border: '3px solid #FF6B35',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)'
          }}>
            <h3 style={{margin: '0 0 12px 0', textAlign: 'center'}}>🏆 Hall of Achievements</h3>
            <div style={{fontSize: '9px', lineHeight: '1.4'}}>
              <div style={{background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '5px', marginBottom: '8px'}}>
                <strong>🥇 ASSIST Tech Challenge 2023</strong><br/>First Place Winner - Outstanding Innovation
              </div>
              <div style={{background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '5px', marginBottom: '8px'}}>
                <strong>💼 Multiple Internships</strong><br/>Arobs, Pentalog, Assist Software
              </div>
              <div style={{background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '5px'}}>
                <strong>🏐 Volleyball Team Application</strong><br/>Custom Mobile Development
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Simple Professional Desk
const InteractiveDesk = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Main Desk Surface */}
    <mesh position={[0, 0, 0]} castShadow receiveShadow>
      <boxGeometry args={[6, 0.1, 2.5]} />
      <meshStandardMaterial 
        color="#4A3426" 
        roughness={0.3} 
        metalness={0.1}
      />
    </mesh>
    
    {/* Left Support Panel */}
    <mesh position={[-2.4, -0.4, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.2, 0.8, 2.3]} />
      <meshStandardMaterial color="#3A2B1A" roughness={0.4} />
    </mesh>
    
    {/* Right Support Panel */}
    <mesh position={[2.4, -0.4, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.2, 0.8, 2.3]} />
      <meshStandardMaterial color="#3A2B1A" roughness={0.4} />
    </mesh>
    
    {/* Back Panel */}
    <mesh position={[0, -0.3, -1.15]} castShadow receiveShadow>
      <boxGeometry args={[6, 0.6, 0.1]} />
      <meshStandardMaterial color="#3A2B1A" roughness={0.4} />
    </mesh>
    
    {/* Simple drawer handles */}
    <mesh position={[-2.4, -0.2, 1]} castShadow>
      <boxGeometry args={[0.04, 0.04, 0.3]} />
      <meshStandardMaterial color="#C0A080" metalness={0.8} roughness={0.2} />
    </mesh>
    
    <mesh position={[2.4, -0.2, 1]} castShadow>
      <boxGeometry args={[0.04, 0.04, 0.3]} />
      <meshStandardMaterial color="#C0A080" metalness={0.8} roughness={0.2} />
    </mesh>
  </group>
);

// Interactive Notebook on Side Table
const InteractiveNotebook = ({ position }: { position: [number, number, number] }) => {
  const { interactions } = useInteractions();
  const showExperience = interactions.notebookOpen;
  
  return (
    <group position={position}>
      <mesh rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#654321" roughness={0.8} metalness={0.1} />
      </mesh>
      
      <mesh position={[-0.2, 0.05, 0]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.1, 0.15, 0.5]} />
        <meshStandardMaterial color="#2C1810" metalness={0.2} />
      </mesh>
      
      <mesh position={[0.2, 0.08, -0.2]} rotation={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5]}  />
        <meshStandardMaterial color="#1A1A1A" metalness={0.8} />
      </mesh>
      
      {showExperience && (
        <Html position={[0, 1, 0]} transform>
          <div style={{
            background: 'rgba(0,0,0,0.95)',
            padding: '20px',
            borderRadius: '10px',
            fontSize: '10px',
            color: 'white',
            width: '280px',
            
            border: '3px solid #00ff88',
            boxShadow: '0 0 30px rgba(0,255,136,0.4)'
          }}>
            <h3 style={{margin: '0 0 12px 0', color: '#00ff88', textAlign: 'center'}}>💼 Professional Journey</h3>
            <div style={{fontSize: '9px', lineHeight: '1.4'}}>
              <div style={{background: 'rgba(0,255,136,0.1)', padding: '8px', borderRadius: '5px', marginBottom: '8px'}}>
                <strong>🚀 Junior Web Developer</strong><br/>
                Navitech Systems (2024-Present)<br/>
                <span style={{opacity: 0.8}}>Building innovative web solutions</span>
              </div>
              <div style={{background: 'rgba(0,255,136,0.1)', padding: '8px', borderRadius: '5px', marginBottom: '8px'}}>
                <strong>👨‍🏫 Teacher</strong><br/>
                Impact Academies (2024-Present)<br/>
                <span style={{opacity: 0.8}}>Mentoring next-gen developers</span>
              </div>
              <div style={{background: 'rgba(100,100,100,0.2)', padding: '8px', borderRadius: '5px', marginBottom: '6px'}}>
                <strong>💻 C Internship</strong> - Arobs (2023)
              </div>
              <div style={{background: 'rgba(100,100,100,0.2)', padding: '8px', borderRadius: '5px', marginBottom: '6px'}}>
                <strong>📱 Android Kotlin</strong> - Pentalog (2022)
              </div>
              <div style={{background: 'rgba(100,100,100,0.2)', padding: '8px', borderRadius: '5px'}}>
                <strong>☕ Java</strong> - Assist Software (2021)
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Interactive Phone - Static for performance
const InteractivePhone = ({ position }: { position: [number, number, number] }) => {
  const { interactions } = useInteractions();
  const showContact = interactions.phoneOpen;
  const phoneRef = useRef<THREE.Group>(null);
  
  // NO useFrame - static for performance
  
  return (
    <group ref={phoneRef} position={position}>
      {/* Modern Smartphone */}
      <mesh>
        <boxGeometry args={[0.35, 0.08, 0.7]} />
        <meshStandardMaterial color="#1A1A1A" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Screen */}
      <mesh position={[0, 0.045, 0]}>
        <boxGeometry args={[0.32, 0.01, 0.65]} />
        <meshStandardMaterial 
          color={showContact ? "#0066ff" : "#000000"}
          emissive={showContact ? "#001133" : "#000000"}
          emissiveIntensity={showContact ? 0.5 : 0}
        />
      </mesh>
      
      {/* Camera */}
      <mesh position={[0.1, 0.05, 0.3]}>
        <cylinderGeometry args={[0.02, 0.02, 0.01]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {showContact && (
        <Html position={[0, 1, 0]} transform>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px',
            borderRadius: '15px',
            fontSize: '11px',
            color: 'white',
            width: '240px',
            textAlign: 'center',
            border: '3px solid #00aaff',
            boxShadow: '0 0 25px rgba(0, 170, 255, 0.5)'
          }}>
            <h3 style={{margin: '0 0 12px 0'}}>📞 Let's Connect!</h3>
            <div style={{fontSize: '10px', background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px'}}>
              <p style={{margin: '0 0 8px 0'}}>📧 beniamindumitriu@gmail.com</p>
              <p style={{margin: '0 0 8px 0'}}>📱 +40747651829</p>
              <p style={{margin: '0 0 8px 0'}}>💼 LinkedIn: /in/dumitriu-beniamin-147649208</p>
              <p style={{margin: '0'}}>🌐 GitHub: /beniamindumitriu</p>
            </div>
            
            {/* Interactive Action Buttons */}
            <div style={{marginTop: '12px', display: 'flex', justifyContent: 'space-around', gap: '8px'}}>
              <button 
                style={{
                  background: '#FF6B6B',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'white',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(255,107,107,0.3)',
                  transition: 'all 0.3s'
                }}
                onClick={() => window.open('mailto:beniamindumitriu@gmail.com', '_blank')}
                onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'scale(1.05)'}
                onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'scale(1)'}
              >
                📧 E - Email
              </button>
              
              <button 
                style={{
                  background: '#4ECDC4',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'white',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(78,205,196,0.3)',
                  transition: 'all 0.3s'
                }}
                onClick={() => window.open('https://www.linkedin.com/in/dumitriu-beniamin-147649208/', '_blank')}
                onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'scale(1.05)'}
                onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'scale(1)'}
              >
                💼 L - LinkedIn
              </button>

            </div>
            
            <div style={{marginTop: '10px', fontSize: '8px', opacity: 0.9, background: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '5px'}}>
              💡 <strong>Keyboard Shortcuts:</strong><br/>
              E = Email | L = LinkedIn<br/>
              <span style={{opacity: 0.7}}>(Only works when near phone)</span>
            </div>
            
            <div style={{marginTop: '6px', fontSize: '9px', opacity: 0.8}}>
              Always open to new opportunities! 🚀
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Simple Plant (Optimized)
const InteractivePlant = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Modern Planter */}
    <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.5, 0.4, 0.6]} />
      <meshStandardMaterial color="#2C2C2C" metalness={0.6} roughness={0.3} />
    </mesh>
    
    {/* Soil */}
    <mesh position={[0, 0.05, 0]}>
      <cylinderGeometry args={[0.45, 0.45, 0.1]} />
      <meshStandardMaterial color="#4A2C2A" roughness={0.9} />
    </mesh>
    
    {/* Main Plant */}
    <mesh position={[0, 0.3, 0]} castShadow>
      <sphereGeometry args={[0.5]} />
      <meshStandardMaterial color="#228B22" roughness={0.8} />
    </mesh>
    
    {/* Simple Additional Leaves (Fixed positions) */}
    <mesh position={[0.3, 0.2, 0]} castShadow>
      <sphereGeometry args={[0.15]} />
      <meshStandardMaterial color="#32CD32" roughness={0.7} />
    </mesh>
    <mesh position={[-0.3, 0.2, 0]} castShadow>
      <sphereGeometry args={[0.15]} />
      <meshStandardMaterial color="#32CD32" roughness={0.7} />
    </mesh>
    <mesh position={[0, 0.2, 0.3]} castShadow>
      <sphereGeometry args={[0.15]} />
      <meshStandardMaterial color="#32CD32" roughness={0.7} />
    </mesh>
  </group>
);

// Simple Modern Floor Lamp (Optimized)
const InteractiveFloorLamp = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Lamp Shade */}
    <mesh position={[0, 2.3, 0]} castShadow>
      <cylinderGeometry args={[0.6, 0.5, 0.4]} />
      <meshStandardMaterial color="#FFF8DC" roughness={0.3} />
    </mesh>
    
    {/* Simple Stand */}
    <mesh position={[0, 1.2, 0]} castShadow>
      <cylinderGeometry args={[0.03, 0.03, 2.4]} />
      <meshStandardMaterial color="#2C2C2C" metalness={0.8} roughness={0.2} />
    </mesh>
    
    {/* Simple Round Base */}
    <mesh position={[0, 0.05, 0]} receiveShadow>
      <cylinderGeometry args={[0.4, 0.4, 0.1]} />
      <meshStandardMaterial color="#2C2C2C" metalness={0.6} roughness={0.3} />
    </mesh>
    
    {/* Single Warm Light */}
    <pointLight position={[0, 2.5, 0]} intensity={1} color="#FFF8DC" distance={8} />
  </group>
);

// Modern Staircase Component
const ModernStaircase = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Stair Steps */}
    {Array.from({ length: 8 }, (_, i) => (
      <group key={i} position={[0, i * 0.5, -i * 0.8]}>
        {/* Step */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4, 0.2, 0.8]} />
          <meshStandardMaterial color="#2C2C2C" metalness={0.6} roughness={0.3} />
        </mesh>
        
        {/* Riser */}
        <mesh position={[0, -0.25, 0.4]} castShadow>
          <boxGeometry args={[4, 0.3, 0.05]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    ))}
    
    {/* Left Handrail */}
    <mesh position={[-1.8, 2, -3]} castShadow>
      <cylinderGeometry args={[0.05, 0.05, 4.5]} />
      <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
    </mesh>
    
    {/* Right Handrail */}
    <mesh position={[1.8, 2, -3]} castShadow>
      <cylinderGeometry args={[0.05, 0.05, 4.5]} />
      <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
    </mesh>
    
    {/* Support Posts */}
    {Array.from({ length: 5 }, (_, i) => (
      <group key={i}>
        <mesh position={[-1.8, 1, -i * 1.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 2]} />
          <meshStandardMaterial color="#2C2C2C" metalness={0.8} />
        </mesh>
        <mesh position={[1.8, 1, -i * 1.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 2]} />
          <meshStandardMaterial color="#2C2C2C" metalness={0.8} />
        </mesh>
      </group>
    ))}
  </group>
);

// Floating Project Component with Real Images
const FloatingProject = ({ 
  position, 
  title, 
  description, 
  tech, 
  color,
  link,
  image
}: { 
  position: [number, number, number];
  title: string;
  description: string;
  tech: string[];
  color: string;
  link?: string;
  image: string;
}) => {
  // NO useFrame - pure CSS animations for smooth performance

  return (
    <group 
      position={position}
    >
      {/* Project Frame */}
      <mesh castShadow>
        <boxGeometry args={[4, 3, 0.15]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.6} 
          roughness={0.2}
          emissive={'#000000'}
          emissiveIntensity={0}
        />
      </mesh>
      
      {/* Glowing Border */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[4.1, 3.1, 0.02]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          transparent 
          opacity={0.4}
          emissive="#FFFFFF"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Project Image */}
      <Html position={[0, 0, 0.1]} transform>
        <div style={{
          width: '360px',
          height: '270px',
          background: `linear-gradient(135deg, ${color}DD, ${color}AA)`,
          borderRadius: '15px',
          padding: '20px',
          color: 'white',
          fontSize: '12px',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'default',
          border: '3px solid transparent',
          transition: 'all 0.4s ease',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          animation: `smoothFloat${Math.abs(position[0] + position[2])} 8s ease-in-out infinite`
        }}>
          <style>{`
            @keyframes smoothFloat${Math.abs(position[0] + position[2])} {
              0% { transform: translateY(0px) rotateY(0deg) scale(1); }
              25% { transform: translateY(-8px) rotateY(2deg) scale(1.02); }
              50% { transform: translateY(0px) rotateY(0deg) scale(1); }
              75% { transform: translateY(8px) rotateY(-2deg) scale(0.98); }
              100% { transform: translateY(0px) rotateY(0deg) scale(1); }
            }
          `}</style>
          <div style={{
            width: '100%',
            height: '180px',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '10px',
            marginBottom: '15px',
            border: '2px solid rgba(255,255,255,0.3)'
          }} />
          
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
              {title}
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '11px', opacity: 0.9 }}>
              {description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {tech.map((t, i) => (
                <span key={i} style={{
                  background: 'rgba(255,255,255,0.25)',
                  padding: '4px 8px',
                  borderRadius: '10px',
                  fontSize: '9px',
                  fontWeight: 'bold'
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};

// Second Floor Component
const SecondFloor = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Floor Platform with Stair Opening */}
    {/* Main floor sections around the stair opening */}
    <mesh position={[-10, -0.1, 0]} receiveShadow>
      <boxGeometry args={[5, 0.2, 25]} />
      <meshStandardMaterial color="#F5F5DC" roughness={0.8} metalness={0.1} />
    </mesh>
    <mesh position={[10, -0.1, 0]} receiveShadow>
      <boxGeometry args={[5, 0.2, 25]} />
      <meshStandardMaterial color="#F5F5DC" roughness={0.8} metalness={0.1} />
    </mesh>
    <mesh position={[0, -0.1, 10]} receiveShadow>
      <boxGeometry args={[10, 0.2, 5]} />
      <meshStandardMaterial color="#F5F5DC" roughness={0.8} metalness={0.1} />
    </mesh>
    <mesh position={[0, -0.1, -10]} receiveShadow>
      <boxGeometry args={[10, 0.2, 5]} />
      <meshStandardMaterial color="#F5F5DC" roughness={0.8} metalness={0.1} />
    </mesh>
    
    {/* Glass Railings */}
    <mesh position={[0, 1, 12.4]} receiveShadow>
      <boxGeometry args={[25, 2, 0.1]} />
      <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} />
    </mesh>
    <mesh position={[0, 1, -12.4]} receiveShadow>
      <boxGeometry args={[25, 2, 0.1]} />
      <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} />
    </mesh>
    <mesh position={[12.4, 1, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow>
      <boxGeometry args={[25, 2, 0.1]} />
      <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} />
    </mesh>
    <mesh position={[-12.4, 1, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow>
      <boxGeometry args={[25, 2, 0.1]} />
      <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} />
    </mesh>
    
    {/* Projects Display - Real Websites - Arranged in Circle */}
    {/* Featured Project - Second.vet in Center with Special Animation */}
    <FloatingProject 
      position={[0, 2.5, 0]}
      title="Second.vet"
      description="Expert X-ray interpretation platform for pets - Connect with certified veterinarians for fast and reliable insights."
      tech={["Veterinary Tech", "X-ray Analysis", "Pet Health", "Telemedicine"]}
      color="#8b5cf6"
      image="/images/secondvet.png"
    />
    
    <FloatingProject 
      position={[-6, 1.5, -6]}
      title="Patternest"
      description="Premium sewing patterns platform offering digital and paper patterns with worldwide shipping."
      tech={["E-Commerce", "Digital Patterns", "Global Shipping", "Fashion"]}
      color="#667eea"
      image="/images/patternest.png"
    />
    
    <FloatingProject 
      position={[6, 1.5, -6]}
      title="Anthem Real Estate"
      description="Bucharest premium real estate platform connecting buyers, sellers, and investors with luxury properties."
      tech={["Real Estate", "Property Management", "Investment", "Bucharest"]}
      color="#f093fb"
      image="/images/anthem.png"
    />
    
    <FloatingProject 
      position={[-6, 1.5, 6]}
      title="Eventuary"
      description="Professional event planning and management platform for creating memorable experiences."
      tech={["Event Planning", "Management", "Professional Services", "Experience"]}
      color="#4facfe"
      image="/images/eventuary.png"
    />
    
    <FloatingProject 
      position={[6, 1.5, 6]}
      title="Vinyllaz"
      description="Premium vinyl records platform featuring curated collections and music discovery."
      tech={["Music", "Vinyl Records", "Collections", "Discovery"]}
      color="#43e97b"
      image="/images/vinyllaz.png"
    />
    
    <FloatingProject 
      position={[0, 1.5, -8]}
      title="Nodart"
      description="Custom handcrafted macrame art pieces and home decor solutions for modern living spaces."
      tech={["Handcraft", "Macrame", "Home Decor", "Custom Art"]}
      color="#fa709a"
      image="/images/nodart.png"
    />
    
    {/* Ambient Lighting for Projects - Circular Arrangement */}
    {[
      { pos: [0, 3, 0], color: "#8b5cf6" }, // Second.vet - center, elevated
      { pos: [-6, 2, -6], color: "#667eea" },
      { pos: [6, 2, -6], color: "#f093fb" },
      { pos: [-6, 2, 6], color: "#4facfe" },
      { pos: [6, 2, 6], color: "#43e97b" },
      { pos: [0, 2, -8], color: "#fa709a" }
    ].map((light, i) => (
      <pointLight 
        key={i}
        position={light.pos as [number, number, number]}
        intensity={i === 0 ? 0.8 : 0.5} // Second.vet gets stronger lighting
        color={light.color}
        distance={i === 0 ? 8 : 6} // Second.vet gets wider reach
      />
    ))}
  </group>
);

// Optimized Proximity Detection Hook - Reduced update frequency
const useProximityDetection = (camera: THREE.Camera, objects: { position: [number, number, number], name: string, distance: number, id: string }[]) => {
  const [nearbyObject, setNearbyObject] = useState<{ name: string, id: string } | null>(null);
  const frameCounter = useRef(0);
  
  useFrame(() => {
    // Only check proximity every 5 frames for better responsiveness
    frameCounter.current++;
    if (frameCounter.current % 5 !== 0) return;
    
    const cameraPos = camera.position;
    let closestObject: { name: string, id: string } | null = null;
    let minDistance = Infinity;
    
    objects.forEach(obj => {
      const objPos = new THREE.Vector3(...obj.position);
      const distance = cameraPos.distanceTo(objPos);
      if (distance < obj.distance && distance < minDistance) {
        closestObject = { name: obj.name, id: obj.id };
        minDistance = distance;
      }
    });
    
    setNearbyObject(closestObject);
  });
  
  return nearbyObject;
};

// Interactive Prompt Component - Shows next to objects
const InteractivePrompt = ({ 
  position, 
  message, 
  visible, 
  objectId 
}: { 
  position: [number, number, number];
  message: string;
  visible: boolean;
  objectId: string;
}) => {
  if (!visible) return null;
  
  return (
    <group position={[position[0], position[1] + 1.5, position[2]]}>
      <Html center>
        <div style={{
          background: 'rgba(0,0,0,0.9)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold',
          border: '2px solid #00ff88',
          boxShadow: '0 0 20px rgba(0,255,136,0.4)',
          animation: 'bounce 1s infinite',
          whiteSpace: 'nowrap',
          textAlign: 'center'
        }}>
          <style>{`
            @keyframes bounce {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-5px) scale(1.05); }
            }
          `}</style>
          {message}
        </div>
      </Html>
    </group>
  );
};

// Simple Exclamation Mark for availability
const ExclamationMark = ({ position, visible }: { position: [number, number, number], visible: boolean }) => {
  if (!visible) return null;
  
  return (
    <group position={[position[0], position[1] + 1, position[2]]}>
      <Html center>
        <div style={{
          fontSize: '20px',
          color: '#FFD700',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          animation: 'bounce 1s infinite'
        }}>
          ❗
        </div>
      </Html>
    </group>
  );
};

// Proximity Prompts Component
const ProximityPrompts = ({ onExitHouse }: { onExitHouse: () => void }) => {
  const { camera } = useThree();
  const { toggleInteraction, interactions } = useInteractions();
  
  // Interactive objects with their prompts
  const interactiveObjects = [
    { position: [0.5, 0.95, 0] as [number, number, number], name: "💻 Press F to open Laptop", distance: 3, id: "laptop" },
    { position: [-14.5, 3, -8] as [number, number, number], name: "📋 Press F to view Skills", distance: 5, id: "whiteboard" },
    { position: [14.5, 3, -8] as [number, number, number], name: "🖥️ Press F to view Education", distance: 5, id: "monitor" },
    { position: [-8, 1, -12] as [number, number, number], name: "🏆 Press F to view Achievements", distance: 3, id: "trophy" },
    { position: [-8, 1.3, 10] as [number, number, number], name: "📖 Press F to read Experience", distance: 3, id: "notebook" },
    { position: [8, 1.15, 10] as [number, number, number], name: "📱 Press F for Contact (E=Email, L=LinkedIn)", distance: 3, id: "phone" },
    { position: [0, 1.5, 14.9] as [number, number, number], name: "🚪 Press F to exit house", distance: 4, id: "door" },
  ];
  
  const nearbyObject = useProximityDetection(camera, interactiveObjects);
  
  // Show prompt only for the nearest object
  return (
    <>
      {interactiveObjects.map(obj => (
        <InteractivePrompt
          key={obj.id}
          position={obj.position}
          message={obj.name}
          visible={nearbyObject?.id === obj.id}
          objectId={obj.id}
        />
      ))}
    </>
  );
};

// Simple First Person Controller
const FirstPersonControls = ({ 
  onDoorInteraction, 
  isInsideHouse,
  mobileControls
}: { 
  onDoorInteraction: () => void;
  isInsideHouse: boolean;
  mobileControls?: any;
}) => {
  const keys = useKeyboardControls(mobileControls);
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const verticalVelocity = useRef(0);
  const isGrounded = useRef(true);
  const groundLevel = 2.2;
  const lastInteractionTime = useRef(0);
  const lastShortcutTime = useRef({ e: 0, l: 0 });
  const { toggleInteraction } = useInteractions();
  
  // Obiecte interactive pentru proximity detection - REORGANIZED POSITIONS
  const interactiveObjects = isInsideHouse ? [
    // Ground Floor Objects
    { position: [0.5, 0.95, 0] as [number, number, number], name: "💻 Laptop - Press F to open", distance: 3, id: "laptop" },
    { position: [-14.5, 3, -8] as [number, number, number], name: "📋 Skills Whiteboard - Press F to view", distance: 5, id: "whiteboard" },
    { position: [14.5, 3, -8] as [number, number, number], name: "🖥️ Education Monitor - Press F to view", distance: 5, id: "monitor" },
    { position: [-8, 1, -12] as [number, number, number], name: "🏆 Trophy Case - Press F to view achievements", distance: 3, id: "trophy" },
    { position: [-8, 1.3, 10] as [number, number, number], name: "📖 Experience Notebook - Press F to read", distance: 3, id: "notebook" },
    { position: [8, 1.15, 10] as [number, number, number], name: "📱 Contact Phone - Press F to view", distance: 3, id: "phone" },
    { position: [0, 1.5, 14.9] as [number, number, number], name: "🚪 Exit Door - Press F to leave house", distance: 4, id: "door" },
  ] : [];
  
  const nearbyObject = useProximityDetection(camera, interactiveObjects);
  
  // Collision Objects - Define collision boundaries
  const collisionObjects = isInsideHouse ? [
    // Central Desk
    { position: [0, 0.8, 0], size: [6.2, 1, 2.7] },
    // Side Table (left) - updated for new table
    { position: [-8, 0, 10], size: [1.4, 1.3, 1.4] },
    // Phone Shelf (right)
    { position: [8, 1, 10], size: [2.4, 1, 1.2] },
    // Trophy Case
    { position: [-8, 0, -12], size: [1.9, 2.5, 1.9] },
    // Plant
    { position: [3, 1.2, 0], size: [1.2, 1, 1.2] },
    // Floor Lamps
    { position: [-10, 0, 5], size: [0.8, 2.5, 0.8] },
    { position: [10, 0, 5], size: [0.8, 2.5, 0.8] },
    // Walls
    { position: [0, 5, -14.9], size: [30, 10, 0.5] }, // Back wall
    { position: [-14.9, 5, 0], size: [0.5, 10, 30] }, // Left wall
    { position: [14.9, 5, 0], size: [0.5, 10, 30] }, // Right wall
    { position: [0, 5, 14.9], size: [30, 10, 0.5] }, // Front wall

    //notebook
    { position: [-8, 1.3, 10], size: [0.5, 0.1, 0.5] },
    //phone
    { position: [8, 1.15, 10], size: [0.5, 0.1, 0.5] },

    
  ] : [];

  const checkCollision = (newPos: THREE.Vector3) => {
    for (const obj of collisionObjects) {
      const objPos = new THREE.Vector3(...obj.position);
      const [w, h, d] = obj.size;
      
      // Check if camera would be inside object bounds
      if (
        newPos.x > objPos.x - w/2 - 0.3 && newPos.x < objPos.x + w/2 + 0.3 &&
        newPos.y > objPos.y - h/2 && newPos.y < objPos.y + h/2 + 1 &&
        newPos.z > objPos.z - d/2 - 0.3 && newPos.z < objPos.z + d/2 + 0.3
      ) {
        return true; // Collision detected
      }
    }
    return false;
  };
  
  useFrame((state, delta) => {
    const { forward, backward, left, right, jump, run, interact } = keys;
    
    // Handle F key interactions with nearby objects
    if (interact && nearbyObject && isInsideHouse) {
      const currentTime = Date.now();
      if (currentTime - lastInteractionTime.current > 300) { // 300ms cooldown
        
        console.log('🎯 F key pressed near object:', nearbyObject.id);
        
        try {
          // Special case for door - exit house
          if (nearbyObject.id === 'door') {
            console.log('🚪 Exiting house...');
            onDoorInteraction();
          } else {
            console.log('🔧 Toggling interaction for:', nearbyObject.id);
            toggleInteraction(nearbyObject.id);
          }
        } catch (error) {
          console.error('❌ Error in F key interaction:', error);
        }
        
        lastInteractionTime.current = currentTime;
      }
    }
    
    // Handle contact shortcuts when near phone - ONLY when pressed (not held)
    if (isInsideHouse && nearbyObject?.id === 'phone') {
      const currentTime = Date.now();
      
      // E key for Email (only on key press, not hold)
      if (keys.e && currentTime - lastShortcutTime.current.e > 1000) {
        console.log('Opening email...');
        window.open('mailto:beniamindumitriu@gmail.com', '_blank');
        lastShortcutTime.current.e = currentTime;
        
        // Force reset the E key state to prevent retriggering
        setTimeout(() => {
          // Trigger a programmatic keyup event to reset the state
          const keyUpEvent = new KeyboardEvent('keyup', { code: 'KeyE' });
          window.dispatchEvent(keyUpEvent);
        }, 100);
      }
      
      // L key for LinkedIn (only on key press, not hold)
      if (keys.l && currentTime - lastShortcutTime.current.l > 1000) {
        console.log('Opening LinkedIn...');
        window.open('https://www.linkedin.com/in/dumitriu-beniamin-147649208/', '_blank');
        lastShortcutTime.current.l = currentTime;
        
        // Force reset the L key state to prevent retriggering
        setTimeout(() => {
          // Trigger a programmatic keyup event to reset the state
          const keyUpEvent = new KeyboardEvent('keyup', { code: 'KeyL' });
          window.dispatchEvent(keyUpEvent);
        }, 100);
      }
      

    }
    
    // Handle door interaction when outside
    if (interact && !isInsideHouse) {
      const pos = camera.position;
      if (pos.z > -2 && pos.z < 2 && Math.abs(pos.x) < 3) {
        onDoorInteraction();
      }
    }
    
    // Movement speed
    const speed = run ? 15 : 8;
    
    // Get camera direction
    camera.getWorldDirection(direction.current);
    const rightVector = new THREE.Vector3();
    rightVector.crossVectors(camera.up, direction.current).normalize();
    
    // Reset velocity
    velocity.current.set(0, 0, 0);
    
    // Calculate movement based on camera direction
    if (forward) velocity.current.add(direction.current);
    if (backward) velocity.current.sub(direction.current);
    if (left) velocity.current.add(rightVector);
    if (right) velocity.current.sub(rightVector);
    
    // Apply movement with collision detection
    velocity.current.normalize();
    velocity.current.multiplyScalar(speed * delta);
    velocity.current.y = 0; // Don't move vertically
    
    // Check collision before moving
    const newPosition = camera.position.clone().add(velocity.current);
    
    if (isInsideHouse && checkCollision(newPosition)) {
      // Try moving only on X axis
      const xOnlyPos = camera.position.clone();
      xOnlyPos.x = newPosition.x;
      if (!checkCollision(xOnlyPos)) {
        camera.position.x = newPosition.x;
      }
      
      // Try moving only on Z axis
      const zOnlyPos = camera.position.clone();
      zOnlyPos.z = newPosition.z;
      if (!checkCollision(zOnlyPos)) {
        camera.position.z = newPosition.z;
      }
    } else {
      // No collision, move normally
      camera.position.add(velocity.current);
    }
    
    // Jump and gravity system
    if (jump && isGrounded.current) {
      verticalVelocity.current = 8; // Jump force
      isGrounded.current = false;
    }
    
    // Simple gravity system - stay on ground floor only
    if (!isGrounded.current) {
      verticalVelocity.current -= 25 * delta; // Gravity
      camera.position.y += verticalVelocity.current * delta;
      
      // Check if landed on ground
      if (camera.position.y <= groundLevel) {
        camera.position.y = groundLevel;
        verticalVelocity.current = 0;
        isGrounded.current = true;
      }
    } else {
      // Keep camera at ground level
      camera.position.y = groundLevel;
    }
  });

  // No UI display here - each object will show its own prompt
  return null;
};

// House Exterior
const HouseExterior = ({ onEnterHouse }: { onEnterHouse: () => void }) => {
  const [doorOpen, setDoorOpen] = useState(false);
  const keys = useKeyboardControls();
  
  useFrame(() => {
    if (keys.interact && !doorOpen) {
      setDoorOpen(true);
      setTimeout(() => {
        onEnterHouse();
      }, 1000);
    }
  });

  return (
    <group>
      {/* Ground */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[50, 1, 50]} />
        <meshStandardMaterial color="#4A7C2A" />
      </mesh>
      
      {/* House Walls */}
      <group position={[0, 0, -5]}>
        {/* Front Wall with Door */}
        <mesh position={[0, 3, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 6, 0.5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Door Frame */}
        <mesh position={[0, 1.5, 0.26]} castShadow>
          <boxGeometry args={[2.2, 3.2, 0.1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        
        {/* Door */}
        <group 
          position={[doorOpen ? -0.8 : 0, 1.5, 0.3]} 
          rotation-y={doorOpen ? -Math.PI / 2 : 0}
        >
          <mesh castShadow>
            <boxGeometry args={[2, 3, 0.1]} />
            <meshStandardMaterial color="#4A2C17" />
          </mesh>
          
          {/* Door Handle */}
          <mesh position={[0.8, 0, 0.05]} castShadow>
            <sphereGeometry args={[0.05]} />
            <meshStandardMaterial color="#FFD700" metalness={0.8} />
          </mesh>
        </group>
        
        {/* Side Walls */}
        <mesh position={[-5, 3, -3]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 6, 6]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        <mesh position={[5, 3, -3]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 6, 6]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Back Wall */}
        <mesh position={[0, 3, -6]} castShadow receiveShadow>
          <boxGeometry args={[10, 6, 0.5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Roof */}
        <mesh position={[0, 6.5, -3]} castShadow receiveShadow>
          <boxGeometry args={[11, 0.5, 7]} />
          <meshStandardMaterial color="#722F37" />
        </mesh>
      </group>
      
      {/* Windows */}
      <mesh position={[-3, 2.5, -4.75]} castShadow>
        <boxGeometry args={[1.5, 1.5, 0.1]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} />
      </mesh>
      
      <mesh position={[3, 2.5, -4.75]} castShadow>
        <boxGeometry args={[1.5, 1.5, 0.1]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} />
      </mesh>
      
      {/* Instructions */}
      <Html position={[0, 4, 5]} center>
        <div style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.95), rgba(20,20,40,0.95))',
          color: 'white',
          padding: '25px 30px',
          borderRadius: '20px',
          textAlign: 'center',
          fontSize: '14px',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(0,255,136,0.3)',
          boxShadow: '0 0 30px rgba(0,255,136,0.2), inset 0 0 20px rgba(0,255,136,0.1)',
         
          width: '500px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '20px',
            gap: '10px'
          }}>
            <span style={{ fontSize: '24px' }}>🎮</span>
            <h2 style={{ 
              margin: '0', 
              background: 'linear-gradient(45deg, #00ff88, #00ccff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              CV Game - Beniamin Dumitriu
            </h2>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '8px', 
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            <div style={{ 
              background: 'rgba(0,255,136,0.1)', 
              padding: '8px 12px', 
              borderRadius: '8px',
              border: '1px solid rgba(0,255,136,0.2)'
            }}>
              <strong style={{ color: '#00ff88' }}>WASD</strong><br/>
              <span style={{ fontSize: '11px', opacity: 0.8 }}>Move around</span>
            </div>
            <div style={{ 
              background: 'rgba(0,204,255,0.1)', 
              padding: '8px 12px', 
              borderRadius: '8px',
              border: '1px solid rgba(0,204,255,0.2)'
            }}>
              <strong style={{ color: '#00ccff' }}>Mouse</strong><br/>
              <span style={{ fontSize: '11px', opacity: 0.8 }}>Look around</span>
            </div>
            <div style={{ 
              background: 'rgba(255,170,0,0.1)', 
              padding: '8px 12px', 
              borderRadius: '8px',
              border: '1px solid rgba(255,170,0,0.2)'
            }}>
              <strong style={{ color: '#ffaa00' }}>Shift</strong><br/>
              <span style={{ fontSize: '11px', opacity: 0.8 }}>Run fast</span>
            </div>
            <div style={{ 
              background: 'rgba(255,100,200,0.1)', 
              padding: '8px 12px', 
              borderRadius: '8px',
              border: '1px solid rgba(255,100,200,0.2)'
            }}>
              <strong style={{ color: '#ff64c8' }}>Space</strong><br/>
              <span style={{ fontSize: '11px', opacity: 0.8 }}>Jump</span>
            </div>
          </div>
          
          <div style={{
            background: 'linear-gradient(45deg, rgba(255,170,0,0.2), rgba(255,200,0,0.2))',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '2px solid rgba(255,170,0,0.4)',
            marginBottom: '15px'
          }}>
            <div style={{ fontSize: '16px', marginBottom: '5px' }}>
              <strong style={{ color: '#ffaa00' }}>F</strong> - Interact with door
            </div>
            <div style={{ fontSize: '11px', opacity: 0.9 }}>
              🚪 Walk to the door and press F to enter!
            </div>
          </div>
          <div style={{ fontSize: '11px', opacity: 0.9 }}>
            🖱️ ESC - show cursor
          </div>
          
          <div style={{ 
            fontSize: '12px',
            opacity: 0.7,
            fontStyle: 'italic',
            color: '#00ff88'
          }}>
            ✨ Explore my interactive CV experience!
          </div>
        </div>
      </Html>
    </group>
  );
};

// Game World Interior with Proximity Detection
const GameWorldInterior = ({ onExitHouse, mobileControls, setMobileControls }: { onExitHouse: () => void; mobileControls?: any; setMobileControls?: (controls: any) => void }) => {
  const { interactions } = useInteractions();
  
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'linear-gradient(to bottom, #1a1a1a, #2d2d2d)' }}>
      <Canvas
        shadows
        camera={{ 
          position: [0, 2.2, 12], 
          fov: 75,
          near: 0.01,  // Much closer near plane for better close-up rendering
          far: 1000
        }}
        style={{ background: 'linear-gradient(to bottom, #1a1a1a, #2d2d2d)' }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          precision: "highp",
          stencil: false,
          depth: true
        }}
      >
        <Environment preset="city" />
        <ambientLight intensity={0.4} color="#F0F8FF" />
        
        {/* Main Natural Window Light - Enhanced */}
        <directionalLight 
          position={[20, 15, 10]} 
          intensity={1.2} 
          color="#FFF8DC"
          castShadow
          shadow-mapSize={[4096, 4096]}  // Higher resolution shadows
          shadow-camera-far={100}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
          shadow-bias={-0.0001}
        />
        
        {/* Secondary Fill Light - Enhanced */}
        <directionalLight 
          position={[-15, 12, 8]} 
          intensity={0.6} 
          color="#E6F3FF"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        
        {/* Warm Interior Ambient */}
        <pointLight position={[0, 8, 0]} intensity={0.2} color="#FFE4B5" />
        
        <RobustPointerLockControls />
        <MobileCameraControl />
        <FirstPersonControls 
          onDoorInteraction={onExitHouse}
          isInsideHouse={true}
          mobileControls={mobileControls}
        />
        
        {/* MODERN ORGANIZED CV OBJECTS */}
        
        {/* Central Work Area */}
        <InteractiveDesk position={[0, 0.8, 0]} />
        <InteractiveLaptop3D position={[0.5, 0.95, 0]} />
        <InteractivePlant position={[3, 1.2, 0]} />
        
        {/* Central Staircase */}
        {/* <ModernStaircase position={[0, 0, -2]} /> */}
        
        {/* Second Floor - Projects Gallery */}
        <SecondFloor position={[0, 4.5, 0]} />
        
        {/* Wall-Mounted Displays */}
        <InteractiveWhiteboard position={[-14.5, 3, -8]} />
        <InteractiveMonitor position={[14.5, 3, -8]} />
        
        {/* Trophy Display Area */}
        <TrophyDisplayCase position={[-8, 0, -12]} />
        <InteractiveTrophy position={[-8, 1, -12]} />
        
        {/* Side Furniture Areas */}
        <ModernSideTable position={[-8, 0, 10]} />
        <InteractiveNotebook position={[-8, 1.3, 10]} />
        
        <ModernShelf position={[8, 1, 10]} />
        <InteractivePhone position={[8, 1.15, 10]} />
        
        {/* Modern Lighting */}
        <InteractiveFloorLamp position={[-12, 0, 3]} />
        <InteractiveFloorLamp position={[10, 0, 5]} />
        
        {/* Interactive Quest Markers */}
        {/* Ground Floor Markers */}
        <ExclamationMark position={[0.5, 0.95, 0]} visible={!interactions.laptopOpen} />
        <ExclamationMark position={[-14.5, 3, -8]} visible={!interactions.whiteboardOpen} />
        <ExclamationMark position={[14.5, 3, -8]} visible={!interactions.monitorOpen} />
        <ExclamationMark position={[-8, 1, -12]} visible={!interactions.trophyOpen} />
        <ExclamationMark position={[-8, 1.3, 10]} visible={!interactions.notebookOpen} />
        <ExclamationMark position={[8, 1.15, 10]} visible={!interactions.phoneOpen} />
        <ExclamationMark position={[0, 1.5, 14.9]} visible={true} />

        {/* Interactive Prompts near objects */}
        <ProximityPrompts onExitHouse={onExitHouse} />
        
        {/* Projects are decorative - no interaction markers */}
        
        {/* Exit Door Frame */}
        <mesh position={[0, 1.5, 14.85]} castShadow>
          <boxGeometry args={[2.2, 3.2, 0.1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        
        {/* Exit Door */}
        <mesh 
          position={[0, 1.5, 14.9]} 
          castShadow
        >
          <boxGeometry args={[2, 3, 0.1]} />
          <meshStandardMaterial color="#4A2C17" />
        </mesh>
        
        {/* Door Handle */}
        <mesh position={[0.8, 1.5, 14.95]} castShadow>
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} />
        </mesh>
        
        {/* Beautiful Wooden Floor - Enhanced */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial 
            color="#8B4513" 
            roughness={0.9}
            metalness={0.05}
            envMapIntensity={0.3}
          />
        </mesh>
        
        {/* Floor Wood Planks Pattern - Fixed positioning */}
        {Array.from({ length: 36 }, (_, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[
            -12 + (i % 6) * 4,
            0.005,
            -12 + Math.floor(i / 6) * 4
          ]} receiveShadow>
            <planeGeometry args={[3.8, 3.8]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#A0522D" : "#8B4513"} 
              roughness={0.9}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
        
        {/* Room Walls - Fixed */}
        {/* Back Wall */}
        <mesh position={[0, 5, -14.9]} receiveShadow>
          <planeGeometry args={[30, 10]} />
          <meshStandardMaterial color="#F5F5DC" side={THREE.FrontSide} />
        </mesh>
        
        {/* Left Wall */}
        <mesh position={[-14.9, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[30, 10]} />
          <meshStandardMaterial color="#F5F5DC" side={THREE.FrontSide} />
        </mesh>
        
        {/* Right Wall */}
        <mesh position={[14.9, 5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[30, 10]} />
          <meshStandardMaterial color="#F5F5DC" side={THREE.FrontSide} />
        </mesh>
        
        {/* Front wall with door opening */}
        <group position={[0, 5, 14.9]}>
          <mesh position={[-10, 0, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#F5F5DC" side={THREE.BackSide} />
          </mesh>
          <mesh position={[10, 0, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#F5F5DC" side={THREE.BackSide} />
          </mesh>
          <mesh position={[0, 3.5, 0]} receiveShadow>
            <planeGeometry args={[4, 3]} />
            <meshStandardMaterial color="#F5F5DC" side={THREE.BackSide} />
          </mesh>
        </group>
        
        {/* Modern Ceiling with Recessed Lighting */}
        <mesh position={[0, 9.9, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#F8F8F8" side={THREE.BackSide} roughness={0.8} />
        </mesh>
        
        {/* Simplified Ceiling Lights */}
        {[-8, 0, 8].map(x => 
          [-8, 8].map(z => (
            <group key={`${x}-${z}`} position={[x, 9.8, z]}>
              <mesh>
                <cylinderGeometry args={[0.2, 0.2, 0.05]} />
                <meshStandardMaterial color="#E0E0E0" />
              </mesh>
              <pointLight 
                position={[0, -0.1, 0]} 
                intensity={0.8} 
                color="#FFF8DC"
                distance={12}
              />
            </group>
          ))
        ).flat()}
      </Canvas>
      
      {/* Game UI */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '20px',
        color: 'white',
        background: 'rgba(0,0,0,0.8)',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <div>🎮 Game Mode - Explore Beniamin's CV</div>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>
          WASD: Move | Click to Control Mouse | Space: Jump | F: Interact with Objects | Shift: Run
        </div>
        <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '5px' }}>
          📱 Press F near ! for interaction
        </div>
      </div>

      {/* Mobile UI Controls for interior */}
      {setMobileControls && <MobileUI onControlsChange={setMobileControls} />}
    </div>
  );
};

// Internal Game World Component
const GameWorldCore: React.FC = () => {
  // Start inside the house on mobile devices, outside on desktop
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const [gameState, setGameState] = useState<'outside' | 'inside'>(isMobile ? 'inside' : 'outside');
  const [mobileControls, setMobileControls] = useState<any>(undefined);
  
  usePreventScroll();

  const handleEnterHouse = () => {
    setGameState('inside');
  };

  const handleExitHouse = () => {
    console.log('🔄 Starting house exit transition...');
    
    // Add a small delay to prevent sudden Canvas switches
    setTimeout(() => {
      try {
        console.log('✅ Switching to outside state');
        setGameState('outside');
      } catch (error) {
        console.error('❌ Error switching game state:', error);
      }
    }, 100);
  };

  if (gameState === 'inside') {
    return <GameWorldInterior onExitHouse={handleExitHouse} mobileControls={mobileControls} setMobileControls={setMobileControls} />;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#87CEEB' }}>
      <Canvas
        shadows
        camera={{ 
          fov: 75, 
          near: 0.01,  // Better close-up rendering
          far: 1000,
          position: [0, 2.2, 10]
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          precision: "highp",
          stencil: false,
          depth: true
        }}
      >
        <Environment preset="sunset" />
        <ambientLight intensity={0.8} color="#F0F8FF" />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.5}
          castShadow
          shadow-mapSize={[4096, 4096]}  // Higher resolution shadows
          shadow-camera-far={100}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
          shadow-bias={-0.0001}
        />
        
        <RobustPointerLockControls />
        <MobileCameraControl />
        <FirstPersonControls 
          onDoorInteraction={handleEnterHouse}
          isInsideHouse={false}
          mobileControls={mobileControls}
        />
        <HouseExterior onEnterHouse={handleEnterHouse} />
      </Canvas>
      
      {/* Mobile UI Controls */}
      <MobileUI onControlsChange={setMobileControls} />
        
        {/* Crosshair - visible when pointer is locked */}
        {document.pointerLockElement && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '20px',
            pointerEvents: 'none',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            zIndex: 1000
          }}>
            +
          </div>
        )}

    </div>
  );
};

// Error suppression for pointer lock errors
const suppressPointerLockErrors = () => {
  const originalError = console.error;
  console.error = (...args) => {
    const message = args.join(' ');
    
    // Suppress specific pointer lock related errors
    if (
      message.includes('The user has exited the lock before this request was completed') ||
      message.includes('Unable to use Pointer Lock API') ||
      message.includes('The root document of this element is not valid for pointer lock') ||
      message.includes('SecurityError') && message.includes('pointer')
    ) {
      return; // Suppress these errors
    }
    
    // Show all other errors normally
    originalError.apply(console, args);
  };
  
  return () => {
    console.error = originalError; // Restore original
  };
};

// Main Game World Component with Provider
const GameWorld: React.FC = () => {
  const [webglContextLost, setWebglContextLost] = useState(false);
  
  useEffect(() => {
    // Suppress pointer lock errors
    const restoreConsole = suppressPointerLockErrors();
    
    // WebGL context loss handler
    const handleContextLost = (event: Event) => {
      console.warn('⚠️ WebGL context lost, attempting recovery...');
      event.preventDefault();
      setWebglContextLost(true);
      
      // Attempt to recover after a short delay
      setTimeout(() => {
        console.log('🔄 Recovering WebGL context...');
        setWebglContextLost(false);
      }, 1000);
    };

    const handleContextRestored = () => {
      console.log('✅ WebGL context restored successfully');
      setWebglContextLost(false);
    };
    
    // Global error handler for unhandled pointer lock errors
    const handleGlobalError = (event: ErrorEvent) => {
      const message = event.message || '';
      if (
        message.includes('The user has exited the lock before this request was completed') ||
        message.includes('Unable to use Pointer Lock API') ||
        message.includes('SecurityError') && message.includes('pointer')
      ) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
      
      // Check for WebGL context loss in error messages
      if (message.includes('WebGL') && message.includes('Context Lost')) {
        console.warn('⚠️ WebGL context lost detected in error message');
        setWebglContextLost(true);
        setTimeout(() => setWebglContextLost(false), 1000);
        event.preventDefault();
        return false;
      }
    };
    
    window.addEventListener('error', handleGlobalError);
    
    // Add WebGL context event listeners to canvas when available
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost);
      canvas.addEventListener('webglcontextrestored', handleContextRestored);
    }
    
    // Cleanup function to exit pointer lock when component unmounts
    return () => {
      restoreConsole(); // Restore console
      window.removeEventListener('error', handleGlobalError);
      
      // Remove WebGL context event listeners
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      }
      
      // Safe pointer lock exit
      try {
        if (document.pointerLockElement) {
          document.exitPointerLock();
        }
      } catch (error) {
        // Silently ignore cleanup errors
      }
    };
  }, []);

  // Show recovery UI if WebGL context is lost
  if (webglContextLost) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-white text-2xl mb-2">🔄 Recovering...</h2>
          <p className="text-gray-400">WebGL context is being restored</p>
        </div>
      </div>
    );
  }

  return (
    <InteractionProvider>
      <GameWorldCore />
    </InteractionProvider>
  );
};

export default GameWorld; 