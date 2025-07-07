import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useMobileDetection } from '../hooks/useMobileDetection';
import VirtualButtons from './VirtualButtons';

interface MobileUIProps {
  onControlsChange?: (controls: any) => void;
}

const MobileUI: React.FC<MobileUIProps> = ({ onControlsChange }) => {
  const { isMobile } = useMobileDetection();
  
  // Joystick state
  const [joystickState, setJoystickState] = useState({
    x: 0,
    y: 0,
    isDragging: false,
  });
  
  // Button states
  const [buttonStates, setButtonStates] = useState({
    jump: false,
    interact: false,
    e: false,
    l: false,
  });
  
  // Combined controls state
  const [controls, setControls] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    interact: false,
    e: false,
    l: false,
    joystickX: 0,
    joystickY: 0,
  });
  
  const joystickRef = useRef<HTMLDivElement>(null);

  // Update movement based on joystick
  useEffect(() => {
    const threshold = 0.3;
    const forward = joystickState.y < -threshold;
    const backward = joystickState.y > threshold;
    const left = joystickState.x < -threshold;
    const right = joystickState.x > threshold;

    setControls(prev => ({
      ...prev,
      forward,
      backward,
      left,
      right,
      joystickX: joystickState.x,
      joystickY: joystickState.y,
      ...buttonStates,
    }));
  }, [joystickState, buttonStates]);

  // Notify parent of control changes
  useEffect(() => {
    if (onControlsChange) {
      onControlsChange(controls);
    }
  }, [controls, onControlsChange]);

  // Get joystick position
  const getJoystickPosition = useCallback((clientX: number, clientY: number) => {
    if (!joystickRef.current) return { x: 0, y: 0 };
    
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = rect.width / 2 - 15;
    
    if (distance <= maxDistance) {
      return {
        x: deltaX / maxDistance,
        y: deltaY / maxDistance,
      };
    } else {
      const angle = Math.atan2(deltaY, deltaX);
      return {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
    }
  }, []);

  // Joystick handlers
  const handleJoystickStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const position = getJoystickPosition(touch.clientX, touch.clientY);
    setJoystickState({ x: position.x, y: position.y, isDragging: true });
  }, [getJoystickPosition]);

  const handleJoystickMove = useCallback((e: React.TouchEvent) => {
    if (!joystickState.isDragging) return;
    
    const touch = e.touches[0];
    const position = getJoystickPosition(touch.clientX, touch.clientY);
    setJoystickState(prev => ({ ...prev, x: position.x, y: position.y }));
  }, [getJoystickPosition, joystickState.isDragging]);

  const handleJoystickEnd = useCallback((e: React.TouchEvent) => {
    setJoystickState({ x: 0, y: 0, isDragging: false });
  }, []);

  // Button interaction rate limiting to prevent spam
  const lastButtonPress = useRef<{ [key: string]: number }>({});
  
  // Button handler with rate limiting
  const handleButtonPress = useCallback((button: 'jump' | 'interact' | 'e' | 'l', pressed: boolean) => {
    // Rate limit only for press events (not release)
    if (pressed) {
      const now = Date.now();
      const lastPress = lastButtonPress.current[button] || 0;
      
      // 200ms cooldown between presses for same button to prevent spam
      if (now - lastPress < 200) {
        return;
      }
      
      lastButtonPress.current[button] = now;
    }
    
    setButtonStates(prev => ({
      ...prev,
      [button]: pressed,
    }));
  }, []);

  if (!isMobile) {
    return null;
  }

  // Calculate knob position
  const knobX = joystickState.x * 30;
  const knobY = joystickState.y * 30;

  return (
    <>
      {/* Virtual Joystick */}
      <div
        ref={joystickRef}
        className="fixed bottom-8 right-8 w-20 h-20 rounded-full bg-black/40 border-2 border-white/20 flex items-center justify-center touch-none select-none z-50"
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Direction indicators */}
        <div className="absolute inset-0 rounded-full">
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-white/40 text-xs">↑</div>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-white/40 text-xs">↓</div>
          <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-white/40 text-xs">←</div>
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white/40 text-xs">→</div>
        </div>
        
        {/* Knob */}
        <div
          className={`w-8 h-8 rounded-full bg-white/80 transition-all duration-75 ${
            joystickState.isDragging ? 'scale-110 bg-blue-400/90' : 'scale-100'
          }`}
          style={{
            transform: `translate(${knobX}px, ${knobY}px)`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)',
          }}
        />
        
        {/* Center dot */}
        <div className="absolute w-1 h-1 bg-white/60 rounded-full" />
        
        {/* Label */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white/60 text-xs font-mono">
          MOVE
        </div>
      </div>

      {/* Virtual Buttons */}
      <VirtualButtons
        onButtonPress={handleButtonPress}
        buttonStates={buttonStates}
      />
      
      {/* Instructions */}
      <div
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          zIndex: 100,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          maxWidth: '200px',
        }}
      >
        <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>📱 Mobile Controls</div>
        <div style={{ fontSize: '10px', opacity: 0.8 }}>
          • Touch screen to look around<br/>
          • Use joystick to move<br/>
          • Tap action buttons (F,E,L,Space)
        </div>
      </div>
    </>
  );
};

export default MobileUI; 