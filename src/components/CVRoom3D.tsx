import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera, OrbitControls, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { usePreventScroll } from '../hooks/usePreventScroll';
import { useSpring, a as three } from '@react-spring/three';

// Wooden Desk Component
const WoodenDesk = () => {
  return (
    <group position={[0, 2, 0]}>
      {/* Desktop */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6, 0.3, 2.5]} />
        <meshStandardMaterial color="#D2B48C" roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Legs */}
      {[-2.5, 2.5].map((x, i) => (
        <React.Fragment key={i}>
          {[-1, 1].map((z, j) => (
            <mesh key={j} position={[x, -1.5, z]}>
              <cylinderGeometry args={[0.1, 0.15, 3]} />
              <meshStandardMaterial color="#8B4513" roughness={0.9} />
            </mesh>
          ))}
        </React.Fragment>
      ))}
    </group>
  );
};

// Interactive Laptop Component with Animations
const Laptop3D = () => {
  const laptopRef = useRef<THREE.Group>(null);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  // Spring animation for opening/closing
  const { openValue } = useSpring({ 
    openValue: open ? 1 : 0,
    config: { tension: 280, friction: 60 }
  });
  
  // Cursor management
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  // Floating animation when open
  useFrame((state) => {
    if (laptopRef.current) {
      const t = state.clock.getElapsedTime();
      laptopRef.current.rotation.x = THREE.MathUtils.lerp(
        laptopRef.current.rotation.x, 
        open ? Math.cos(t / 10) / 10 + 0.1 : 0, 
        0.1
      );
      laptopRef.current.rotation.y = THREE.MathUtils.lerp(
        laptopRef.current.rotation.y, 
        open ? Math.sin(t / 10) / 4 : 0, 
        0.1
      );
      laptopRef.current.rotation.z = THREE.MathUtils.lerp(
        laptopRef.current.rotation.z, 
        open ? Math.sin(t / 10) / 10 : 0, 
        0.1
      );
      laptopRef.current.position.y = THREE.MathUtils.lerp(
        laptopRef.current.position.y, 
        open ? 2.8 + Math.sin(t) / 8 : 2.8, 
        0.1
      );
    }
  });

  return (
    <group 
      ref={laptopRef} 
      position={[0.5, 2.8, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        setOpen(!open);
      }}
    >
      {/* Laptop Base - More realistic */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.15, 1.8]} />
        <meshStandardMaterial 
          color="#2C2C2C" 
          metalness={0.9} 
          roughness={0.05}
          envMapIntensity={1.5}
        />
      </mesh>
      
      {/* Screen Group - Animated */}
      <three.group 
        rotation-x={openValue.to([0, 1], [1.5, -0.3])}
        position={[0, 0.08, -0.7]}
      >
        {/* Screen Frame */}
        <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 1.4, 0.1]} />
          <meshStandardMaterial 
            color="#1A1A1A" 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
        
        {/* Screen */}
        <mesh position={[0, 0.7, 0.051]}>
          <boxGeometry args={[2.0, 1.25, 0.02]} />
          <meshStandardMaterial 
            color="#000000" 
            emissive="#001122"
            emissiveIntensity={open ? 0.3 : 0.1}
          />
        </mesh>
        
        {/* Apple Logo */}
        <mesh position={[0, 0.7, -0.051]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial 
            color="#FFFFFF" 
            emissive="#FFFFFF"
            emissiveIntensity={0.2}
          />
        </mesh>
      </three.group>
      
      {/* Keyboard Area */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[2.2, 0.03, 1.6]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.8} />
      </mesh>
      
      {/* Keyboard Keys */}
      {Array.from({ length: 60 }, (_, i) => (
        <mesh key={i} position={[
          -0.9 + (i % 12) * 0.15,
          0.035,
          -0.2 + Math.floor(i / 12) * 0.14
        ]} castShadow>
          <boxGeometry args={[0.12, 0.03, 0.12]} />
          <meshStandardMaterial 
            color={hovered ? "#5A5A5A" : "#4A4A4A"} 
            roughness={0.6} 
          />
        </mesh>
      ))}
      
      {/* Trackpad */}
      <mesh position={[0, 0.04, 0.5]}>
        <boxGeometry args={[1.0, 0.02, 0.6]} />
        <meshStandardMaterial 
          color="#2A2A2A" 
          metalness={0.4} 
          roughness={0.6} 
        />
      </mesh>
      
      {/* Interactive Screen Content */}
      {open && (
        <Html position={[0, 1.3, -0.65]} rotation={[-0.3, 0, 0]} transform>
          <div style={{
            width: '180px',
            height: '120px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '5px',
            padding: '10px',
            fontSize: '6px',
            color: 'white',
            textAlign: 'left',
            overflow: 'hidden',
            boxShadow: '0 0 30px rgba(102, 126, 234, 0.6)',
            animation: 'pulse 2s infinite'
          }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.95)', 
              borderRadius: '4px', 
              padding: '8px',
              color: 'black',
              height: '100%',
              boxSizing: 'border-box'
            }}>
              <h1 style={{ 
                margin: '0 0 6px 0', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                textAlign: 'center', 
                color: '#2C2C2C',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                🚀 Hello, I'm Beniamin Dumitriu
              </h1>
              <div style={{ fontSize: '5px', lineHeight: '1.4' }}>
                <p style={{ margin: '0 0 4px 0' }}><strong style={{ color: '#4CAF50' }}>Summary:</strong></p>
                <p style={{ margin: '0 0 3px 0' }}>I adapt easily to new people and enjoy constructive discussions.</p>
                <p style={{ margin: '0 0 3px 0' }}><strong style={{ color: '#2196F3' }}>Hobbies:</strong> traveling, cycling, volleyball</p>
                <p style={{ margin: '0 0 3px 0' }}><strong style={{ color: '#FF9800' }}>Passion:</strong> robotics and programming</p>
                <p style={{ margin: '0', fontSize: '4px', color: '#666' }}>Click to explore my 3D CV world! 🌟</p>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Plant Component
const Plant = () => {
  return (
    <group position={[-2, 2.8, 0.3]}>
      {/* Pot */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.3, 0.25, 0.6]} />
        <meshStandardMaterial color="#F5F5DC" roughness={0.8} />
      </mesh>
      
      {/* Plant Leaves */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[
          Math.sin(i * 1.2) * 0.2, 
          i * 0.15, 
          Math.cos(i * 1.2) * 0.2
        ]} rotation={[0, i * 0.5, 0]}>
          <boxGeometry args={[0.1, 0.4, 0.02]} />
          <meshStandardMaterial color="#228B22" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
};

// Whiteboard Component
const Whiteboard = () => {
  return (
    <group position={[0, 1, 0]}>
      {/* Board */}
      <mesh>
        <boxGeometry args={[4, 2.5, 0.1]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>
      
      {/* Frame */}
      <mesh>
        <boxGeometry args={[4.2, 2.7, 0.05]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Content */}
      <Html position={[0, 0, 0.06]} transform>
        <div style={{
          width: '350px',
          height: '220px',
          padding: '15px',
          textAlign: 'left',
          color: 'black',
          fontFamily: 'Arial, sans-serif',
          fontSize: '9px'
        }}>
          <h2 style={{ margin: '0 0 15px 0', fontSize: '16px', textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '5px' }}>Skills & Technologies</h2>
          
          <div style={{ marginBottom: '10px' }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '11px', fontWeight: 'bold', color: '#2196F3' }}>Programming Languages:</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
              <span style={{ background: '#e3f2fd', padding: '3px 6px', borderRadius: '3px', fontSize: '9px' }}>C/C++</span>
              <span style={{ background: '#e3f2fd', padding: '3px 6px', borderRadius: '3px', fontSize: '9px' }}>Python</span>
              <span style={{ background: '#e3f2fd', padding: '3px 6px', borderRadius: '3px', fontSize: '9px' }}>Java</span>
              <span style={{ background: '#e3f2fd', padding: '3px 6px', borderRadius: '3px', fontSize: '9px' }}>Kotlin</span>
              <span style={{ background: '#e3f2fd', padding: '3px 6px', borderRadius: '3px', fontSize: '9px' }}>C#</span>
              <span style={{ background: '#e3f2fd', padding: '3px 6px', borderRadius: '3px', fontSize: '9px' }}>JavaScript</span>
              <span style={{ background: '#e3f2fd', padding: '3px 6px', borderRadius: '3px', fontSize: '9px' }}>TypeScript</span>
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '11px', fontWeight: 'bold', color: '#9C27B0' }}>Frameworks & Technologies:</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
              <span style={{ background: '#f3e5f5', padding: '3px 6px', borderRadius: '3px', fontSize: '9px' }}>React</span>
              <span style={{ background: '#f3e5f5', padding: '3px 6px', borderRadius: '3px', fontSize: '9px' }}>Svelte</span>
              <span style={{ background: '#f3e5f5', padding: '3px 6px', borderRadius: '3px', fontSize: '9px' }}>Tailwind</span>
              <span style={{ background: '#f3e5f5', padding: '3px 6px', borderRadius: '3px', fontSize: '9px' }}>NestJs</span>
              <span style={{ background: '#f3e5f5', padding: '3px 6px', borderRadius: '3px', fontSize: '9px' }}>HTML</span>
              <span style={{ background: '#f3e5f5', padding: '3px 6px', borderRadius: '3px', fontSize: '9px' }}>CSS</span>
            </div>
          </div>

          <div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '11px', fontWeight: 'bold', color: '#4CAF50' }}>Tools & Databases:</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              <span style={{ background: '#e8f5e8', padding: '3px 6px', borderRadius: '3px', fontSize: '9px' }}>GitHub</span>
              <span style={{ background: '#e8f5e8', padding: '3px 6px', borderRadius: '3px', fontSize: '9px' }}>BitBucket</span>
              <span style={{ background: '#e8f5e8', padding: '3px 6px', borderRadius: '3px', fontSize: '9px' }}>Eclipse</span>
              <span style={{ background: '#e8f5e8', padding: '3px 6px', borderRadius: '3px', fontSize: '9px' }}>SQL</span>
              <span style={{ background: '#e8f5e8', padding: '3px 6px', borderRadius: '3px', fontSize: '9px' }}>OOP</span>
              <span style={{ background: '#e8f5e8', padding: '3px 6px', borderRadius: '3px', fontSize: '9px' }}>Android Studio</span>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};

// Floor Lamp Component
const FloorLamp = () => {
  return (
    <group position={[-2, -1, 1]}>
      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1]} />
        <meshStandardMaterial color="#2C2C2C" />
      </mesh>
      
      {/* Pole */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 4]} />
        <meshStandardMaterial color="#2C2C2C" />
      </mesh>
      
      {/* Shade */}
      <mesh position={[0, 3.5, 0]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.5, 0.8]} />
        <meshStandardMaterial color="#2C2C2C" />
      </mesh>
      
      {/* Light */}
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#FFF8DC" />
    </group>
  );
};

// Monitor Setup Component
const MonitorSetup = () => {
  return (
    <group position={[0, -1, -2]}>
      {/* Cabinet */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[5, 1.5, 1.8]} />
        <meshStandardMaterial color="#F5F5F5" roughness={0.8} />
      </mesh>
      
      {/* Cabinet Handles */}
      {[-1.5, 1.5].map((x, i) => (
        <mesh key={i} position={[x, -0.3, 0.9]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3]} />
          <meshStandardMaterial color="#888888" />
        </mesh>
      ))}
      
      {/* Monitor */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[3, 2, 0.2]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>
      
      {/* Monitor Stand */}
      <mesh position={[0, 0.2, 0.3]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1]} />
        <meshStandardMaterial color="#2C2C2C" />
      </mesh>
      
      {/* Monitor Content */}
      <Html position={[0, 1, 0.11]} transform>
        <div style={{
          width: '280px',
          height: '160px',
          background: 'white',
          padding: '15px',
          borderRadius: '5px',
          fontSize: '9px',
          color: 'black'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid #2196F3', paddingBottom: '4px' }}>Educational Background</h3>
          
          <div style={{ marginBottom: '12px', background: '#f8f9fa', padding: '8px', borderRadius: '4px', border: '1px solid #e9ecef' }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 'bold', color: '#2196F3' }}>🎓 Bachelor Degree - Computer Science</h4>
            <p style={{ margin: '0 0 2px 0', fontSize: '9px', color: '#666' }}>Stefan cel Mare University</p>
            <p style={{ margin: '0', fontSize: '8px', color: '#888' }}>2020 - 2024</p>
          </div>

          <div style={{ marginBottom: '10px', background: '#f8f9fa', padding: '8px', borderRadius: '4px', border: '1px solid #e9ecef' }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 'bold', color: '#2196F3' }}>📚 High School Degree</h4>
            <p style={{ margin: '0 0 2px 0', fontSize: '9px', color: '#666' }}>Mathematics and Informatics</p>
            <p style={{ margin: '0 0 2px 0', fontSize: '9px', color: '#666' }}>M Eminescu College</p>
            <p style={{ margin: '0', fontSize: '8px', color: '#888' }}>2016 - 2020</p>
          </div>

          <div style={{ fontSize: '8px', color: '#888', textAlign: 'center', marginTop: '8px' }}>
            🌟 Language Proficiency: Romanian (Native), English (Advanced)
          </div>
        </div>
      </Html>
      
      {/* Education Icon */}
      <mesh position={[-2, 0.5, 0.5]}>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>
      
      <Html position={[-2, 0.5, 0.56]} transform>
        <div style={{
          width: '60px',
          height: '60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '16px' }}>🎓</div>
          <div>Educational Background</div>
        </div>
      </Html>
    </group>
  );
};

// Notebook Component
const Notebook = () => {
  return (
    <group position={[-1.5, -2, 0]}>
      {/* Notebook Base */}
      <mesh rotation={[0, 0.3, 0]}>
        <boxGeometry args={[1.5, 0.05, 2]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>
      
      {/* Spiral Binding */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[-0.6, 0.05, -0.8 + i * 0.2]} rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.03, 0.01]} />
          <meshStandardMaterial color="#888888" />
        </mesh>
      ))}
      
      {/* Content */}
      <Html position={[0.2, 0.06, 0]} rotation={[0, 0.3, 0]} transform>
        <div style={{
          width: '140px',
          height: '180px',
          padding: '8px',
          fontSize: '7px',
          color: 'black',
          textAlign: 'left',
          lineHeight: '1.2'
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '10px', textAlign: 'center', fontWeight: 'bold', borderBottom: '1px solid #333' }}>Work Experience</h3>
          
          <div style={{ marginBottom: '6px', fontSize: '6px' }}>
            <div style={{ fontWeight: 'bold', color: '#2196F3' }}>🖥️ Junior Web Developer</div>
            <div style={{ color: '#666' }}>Navitech Systems (2024-Present)</div>
            <div style={{ fontSize: '5px' }}>TypeScript, Svelte, Tailwind</div>
          </div>

          <div style={{ marginBottom: '6px', fontSize: '6px' }}>
            <div style={{ fontWeight: 'bold', color: '#2196F3' }}>👨‍🏫 Teacher Part-time</div>
            <div style={{ color: '#666' }}>Impact Academies (2024-Present)</div>
            <div style={{ fontSize: '5px' }}>Student evaluation & support</div>
          </div>

          <div style={{ marginBottom: '6px', fontSize: '6px' }}>
            <div style={{ fontWeight: 'bold', color: '#2196F3' }}>⚡ C Internship</div>
            <div style={{ color: '#666' }}>Arobs (2023)</div>
            <div style={{ fontSize: '5px' }}>Weather App on EFM32 MCU</div>
          </div>

          <div style={{ marginBottom: '6px', fontSize: '6px' }}>
            <div style={{ fontWeight: 'bold', color: '#2196F3' }}>📱 Android Kotlin Internship</div>
            <div style={{ color: '#666' }}>Pentalog (2022)</div>
            <div style={{ fontSize: '5px' }}>Mobile app development</div>
          </div>

          <div style={{ fontSize: '6px' }}>
            <div style={{ fontWeight: 'bold', color: '#2196F3' }}>☕ Java Internship</div>
            <div style={{ color: '#666' }}>Assist Software (2021)</div>
            <div style={{ fontSize: '5px' }}>Town Guardian app</div>
          </div>
        </div>
      </Html>
    </group>
  );
};

// Trophy Component for ASSIST Tech Challenge 2023
const Trophy = () => {
  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.05}>
      <group position={[2, -1, 0]}>
        {/* Trophy Base */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.1]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </mesh>
        
        {/* Trophy Cup */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.2, 0.15, 0.6]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.1} />
        </mesh>
        
        {/* Trophy Handles */}
        {[-0.25, 0.25].map((x, i) => (
          <mesh key={i} position={[x, 0.5, 0]} rotation={[0, 0, Math.PI/2]}>
            <torusGeometry args={[0.08, 0.02]} />
            <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.1} />
          </mesh>
        ))}
        
        {/* Achievement Info */}
        <Html position={[0, 1.2, 0]} transform>
          <div style={{
            width: '120px',
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '8px',
            borderRadius: '5px',
            fontSize: '8px',
            color: 'black',
            textAlign: 'center',
            border: '2px solid #FFD700'
          }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '4px', color: '#FF6F00' }}>🏆 FIRST PLACE</div>
            <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>ASSIST Tech Challenge 2023</div>
            <div style={{ fontSize: '6px', color: '#666' }}>Full-stack application on surprise theme</div>
          </div>
        </Html>
      </group>
    </Float>
  );
};

// Hobbies Corner Component
const HobbiesCorner = () => {
  return (
    <group position={[0, -2, 0]}>
      {/* Mini Bicycle */}
      <group position={[0, 0, 0]} scale={0.15}>
        {/* Frame */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[2, 0.2]} />
          <meshStandardMaterial color="#2196F3" metalness={0.6} roughness={0.4} />
        </mesh>
        
        {/* Wheels */}
        {[-1.5, 1.5].map((x, i) => (
          <mesh key={i} position={[x, -1, 0]} rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[1, 0.1]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        ))}
        
        {/* Seat */}
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[0.5, 0.1, 0.3]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>
      
      {/* Volleyball */}
      <mesh position={[0.8, 0.3, 0.3]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
      </mesh>
      
      {/* World Map (for traveling) */}
      <mesh position={[0, 0.8, -0.3]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1, 0.6]} />
        <meshStandardMaterial color="#E8F5E8" roughness={0.9} />
      </mesh>
      
      {/* Hobbies Info */}
      <Html position={[0, 1.5, 0]} transform>
        <div style={{
          width: '110px',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '6px',
          borderRadius: '4px',
          fontSize: '7px',
          color: 'black',
          textAlign: 'center',
          border: '1px solid #4CAF50'
        }}>
          <div style={{ fontSize: '9px', fontWeight: 'bold', marginBottom: '4px', color: '#4CAF50' }}>🌟 Hobbies & Interests</div>
          <div style={{ marginBottom: '2px' }}>🚴‍♂️ <strong>Cycling</strong></div>
          <div style={{ marginBottom: '2px' }}>🏐 <strong>Volleyball</strong></div>
          <div style={{ marginBottom: '2px' }}>✈️ <strong>Traveling</strong></div>
          <div style={{ fontSize: '6px', color: '#666' }}>Passionate about sports & exploration</div>
        </div>
      </Html>
    </group>
  );
};

// Elite Trophy Cabinet Component
const TrophyCabinet = () => {
  return (
    <group position={[-3, -2, 0]}>
      {/* Cabinet Base */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.2, 1.5]} />
        <meshStandardMaterial 
          color="#8B4513" 
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>
      
      {/* Cabinet Body */}
      <mesh position={[0, 1, -0.6]} castShadow receiveShadow>
        <boxGeometry args={[3, 2, 0.3]} />
        <meshStandardMaterial 
          color="#D2691E" 
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      
      {/* Glass Shelves */}
      {[0.5, 1.2, 1.9].map((y, i) => (
        <mesh key={i} position={[0, y, -0.5]}>
          <boxGeometry args={[2.8, 0.05, 1.4]} />
          <meshStandardMaterial 
            color="#FFFFFF" 
            transparent
            opacity={0.3}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      ))}
      
      {/* Trophy Display */}
      <mesh position={[0, 1.5, -0.3]} castShadow>
        <cylinderGeometry args={[0.15, 0.1, 0.4]} />
        <meshStandardMaterial 
          color="#FFD700" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#FFD700"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Award Certificates */}
      {[-0.8, 0, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 1.8, -0.55]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.4, 0.6]} />
          <meshStandardMaterial 
            color="#FFFFFF" 
            roughness={0.9}
          />
        </mesh>
      ))}
      
      {/* Projects Info */}
      <Html position={[0, 2.5, 0]} transform>
        <div style={{
          width: '200px',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '10px',
          borderRadius: '8px',
          fontSize: '8px',
          color: 'black',
          textAlign: 'left',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          border: '2px solid #FFD700'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center', color: '#FF6F00' }}>🏆 Projects & Achievements</div>
          
          <div style={{ marginBottom: '6px', background: '#f0f8ff', padding: '4px', borderRadius: '4px' }}>
            <div style={{ fontWeight: 'bold', color: '#2196F3' }}>🏐 Volleyball Team App</div>
            <div style={{ fontSize: '6px', color: '#666' }}>React, HTML, CSS, GitHub</div>
          </div>
          
          <div style={{ marginBottom: '6px', background: '#f0fff0', padding: '4px', borderRadius: '4px' }}>
            <div style={{ fontWeight: 'bold', color: '#4CAF50' }}>💻 Professional Portfolio:</div>
            <div style={{ fontSize: '6px', color: '#2196F3' }}>• vinyllaz.com</div>
            <div style={{ fontSize: '6px', color: '#2196F3' }}>• nodart.ro</div>
            <div style={{ fontSize: '6px', color: '#2196F3' }}>• anthem.ro</div>
            <div style={{ fontSize: '6px', color: '#2196F3' }}>• eventuary.ro</div>
            <div style={{ fontSize: '6px', color: '#2196F3' }}>• patternest.com</div>
          </div>
        </div>
      </Html>
    </group>
  );
};

// Phone Component
const Phone = () => {
  const phoneRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (phoneRef.current) {
      phoneRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.05}>
      <group ref={phoneRef} position={[1.5, -2, 0]}>
        {/* Phone Body - More realistic iPhone style */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.7, 1.4, 0.08]} />
          <meshStandardMaterial 
            color="#1A1A1A" 
            metalness={0.9} 
            roughness={0.1}
            envMapIntensity={1.5}
          />
        </mesh>
        
        {/* Screen Frame */}
        <mesh position={[0, 0, 0.041]} castShadow>
          <boxGeometry args={[0.65, 1.35, 0.01]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        
        {/* Screen */}
        <mesh position={[0, 0, 0.046]}>
          <boxGeometry args={[0.6, 1.25, 0.001]} />
          <meshStandardMaterial 
            color="#000000" 
            emissive="#000033"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Camera */}
        <mesh position={[0, 0.6, 0.045]}>
          <cylinderGeometry args={[0.03, 0.03, 0.01]} />
          <meshStandardMaterial 
            color="#1A1A1A" 
            metalness={0.9} 
            roughness={0.1}
          />
        </mesh>
        
        {/* Home Button */}
        <mesh position={[0, -0.6, 0.045]}>
          <cylinderGeometry args={[0.03, 0.03, 0.005]} />
          <meshStandardMaterial 
            color="#333333" 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
        
        {/* Screen Content */}
        <Html position={[0, 0, 0.045]} transform>
          <div style={{
            width: '40px',
            height: '75px',
            background: '#1A1A1A',
            color: 'white',
            padding: '4px',
            fontSize: '4px',
            textAlign: 'center',
            borderRadius: '3px',
            lineHeight: '1.2'
          }}>
            <div style={{ marginBottom: '4px', fontSize: '6px', fontWeight: 'bold', color: '#4CAF50' }}>📞 Contact</div>
            <div style={{ fontSize: '5px', marginBottom: '3px', fontWeight: 'bold', color: '#FFF' }}>Beniamin Dumitriu</div>
            <div style={{ fontSize: '3px', marginBottom: '3px', color: '#BBB' }}>beniamindumitriu@gmail.com</div>
            <div style={{ fontSize: '4px', marginBottom: '3px', color: '#4CAF50' }}>+40747651829</div>
            <div style={{ fontSize: '3px', marginBottom: '2px', color: '#888' }}>GitHub:</div>
            <div style={{ fontSize: '2px', color: '#2196F3' }}>github.com/BeniaminDumitriu</div>
          </div>
        </Html>
      </group>
    </Float>
  );
};

// Main CV Room Component
const CVRoom3D: React.FC = () => {
  const [cameraPosition] = useState<[number, number, number]>([20, 12, 25]);
  const containerRef = usePreventScroll();

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full relative"
      style={{ touchAction: 'none' }}
    >
      <Canvas 
        shadows
        style={{ width: '100%', height: '100vh' }}
        camera={{ position: [20, 12, 25], fov: 60 }}
      >
        <PerspectiveCamera makeDefault position={cameraPosition} />
        <OrbitControls 
          enableZoom={true} 
          enablePan={true} 
          maxDistance={50}
          minDistance={8}
          maxPolarAngle={Math.PI * 0.8}
          minPolarAngle={Math.PI * 0.1}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.4}
          zoomSpeed={1.0}
          panSpeed={0.6}
        />
        
        {/* Professional Lighting Setup - Realistic Office */}
        <ambientLight intensity={0.4} />
        
        {/* Main Directional Light - Sun through windows */}
        <directionalLight 
          position={[20, 20, 15]} 
          intensity={1.5} 
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-far={100}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />
        
        {/* Office Ceiling Lights */}
        <pointLight position={[-10, 12, -10]} intensity={0.8} color="#FFF8DC" castShadow />
        <pointLight position={[10, 12, -10]} intensity={0.8} color="#FFF8DC" castShadow />
        <pointLight position={[-10, 12, 10]} intensity={0.8} color="#FFF8DC" castShadow />
        <pointLight position={[10, 12, 10]} intensity={0.8} color="#FFF8DC" castShadow />
        
        {/* Accent Lighting */}
        <pointLight position={[0, 15, 0]} intensity={0.4} color="#FFFFFF" />
        <pointLight position={[-15, 8, 0]} intensity={0.3} color="#E3F2FD" />
        <pointLight position={[15, 8, 0]} intensity={0.3} color="#E3F2FD" />
        
        {/* Room Elements - Strategic Professional Layout */}
        <group position={[0, 0, 0]}>
          {/* Central Executive Desk Area */}
          <group position={[0, 0, 5]}>
            <WoodenDesk />
            <Laptop3D />
            <Plant />
          </group>
          
          {/* Left Wall - Skills Showcase */}
          <group position={[-15, 0, -5]}>
            <Whiteboard />
          </group>
          
          {/* Left Area Lighting */}
          <group position={[-12, 0, 0]}>
            <FloorLamp />
          </group>
          
          {/* Right Wall - Education Display */}
          <group position={[15, 0, -5]}>
            <MonitorSetup />
          </group>
          
          {/* Back Left - Trophy & Achievement Wall */}
          <group position={[-8, 0, -15]}>
            <Trophy />
            <TrophyCabinet />
          </group>
          
          {/* Back Right - Projects Display */}
          <group position={[8, 0, -15]}>
            <HobbiesCorner />
          </group>
          
          {/* Front Left - Work Experience */}
          <group position={[-8, 0, 15]}>
            <Notebook />
          </group>
          
          {/* Front Right - Contact */}
          <group position={[8, 0, 15]}>
            <Phone />
          </group>
        </group>
        
        {/* Environment */}
        <Environment preset="apartment" />
        
        {/* Professional Office Space - MUCH LARGER */}
        
        {/* Ground - Massive Professional Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial 
            color="#F8F8F8" 
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
        
        {/* Floor Pattern - Tiles */}
        {Array.from({ length: 144 }, (_, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[
            -25 + (i % 12) * 4.5,
            -4.98,
            -25 + Math.floor(i / 12) * 4.5
          ]} receiveShadow>
            <planeGeometry args={[4, 4]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#FAFAFA" : "#F5F5F5"} 
              roughness={0.8}
            />
          </mesh>
        ))}
        
        {/* Back Wall - HUGE */}
        <mesh position={[0, 5, -25]} receiveShadow>
          <planeGeometry args={[60, 30]} />
          <meshStandardMaterial 
            color="#E8E8E8" 
            roughness={0.9}
          />
        </mesh>
        
        {/* Left Wall - HUGE */}
        <mesh position={[-25, 5, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow>
          <planeGeometry args={[60, 30]} />
          <meshStandardMaterial 
            color="#F0F0F0" 
            roughness={0.9}
          />
        </mesh>
        
        {/* Right Wall - HUGE */}
        <mesh position={[25, 5, 0]} rotation={[0, -Math.PI/2, 0]} receiveShadow>
          <planeGeometry args={[60, 30]} />
          <meshStandardMaterial 
            color="#F0F0F0" 
            roughness={0.9}
          />
        </mesh>
        
        {/* Front Wall - HUGE */}
        <mesh position={[0, 5, 25]} rotation={[0, Math.PI, 0]} receiveShadow>
          <planeGeometry args={[60, 30]} />
          <meshStandardMaterial 
            color="#F0F0F0" 
            roughness={0.9}
          />
        </mesh>
        
        {/* Ceiling */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 15, 0]}>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial 
            color="#FFFFFF" 
            roughness={0.8}
          />
        </mesh>
      </Canvas>
      
      {/* UI Overlay - Enhanced */}
      <motion.div 
        className="absolute top-8 left-8 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="glass px-6 py-4 rounded-lg border border-blue-500/30">
          <h2 className="text-xl font-bold text-white mb-2">🚀 Interactive CV Office</h2>
          <div className="text-gray-300 text-sm space-y-1">
            <p>💻 <strong>Click Laptop:</strong> Open/Close for animations</p>
            <p>🖱️ <strong>Drag:</strong> Rotate camera view</p>
            <p>⚡ <strong>Scroll:</strong> Zoom in/out</p>
            <p>🔍 <strong>Explore:</strong> Each corner has unique content</p>
          </div>
        </div>
      </motion.div>
      
      {/* CV Objects Guide */}
      <motion.div 
        className="absolute top-8 right-8 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="glass px-4 py-3 rounded-lg border border-green-500/30 max-w-xs">
          <h3 className="text-lg font-bold text-white mb-2">🗺️ Office Layout</h3>
          <div className="text-gray-300 text-xs space-y-1">
            <p>🏢 <strong>Center:</strong> Executive Desk (About Me)</p>
            <p>⬅️ <strong>Left Wall:</strong> Skills & Lighting</p>
            <p>➡️ <strong>Right Wall:</strong> Education Monitor</p>
            <p>⬆️ <strong>Back Corners:</strong> Achievements & Hobbies</p>
            <p>⬇️ <strong>Front Corners:</strong> Experience & Contact</p>
            <p>✨ <strong>Pro Tip:</strong> Click the laptop!</p>
          </div>
        </div>
      </motion.div>

      {/* Full Experience Hint */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <div className="glass px-6 py-3 rounded-full border border-purple-500/30">
          <p className="text-gray-300 text-sm text-center">
            ✨ <strong>Beniamin's Interactive CV</strong> - Every object tells a story! 🚀
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CVRoom3D; 