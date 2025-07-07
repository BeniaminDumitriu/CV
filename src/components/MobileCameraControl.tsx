import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useMobileDetection } from '../hooks/useMobileDetection';

const MobileCameraControl: React.FC = () => {
  const { camera, gl } = useThree();
  const { isMobile } = useMobileDetection();
  const rotation = useRef({ x: 0, y: 0 });
  const lastTouch = useRef({ x: 0, y: 0 });
  const touchSensitivity = 0.003;

  useEffect(() => {
    if (!isMobile) return;

    const canvas = gl.domElement;
    
    // Initialize rotation from camera
    rotation.current.x = camera.rotation.x;
    rotation.current.y = camera.rotation.y;

    // Check if touch is in UI control areas (avoid camera control conflicts)
    const isTouchInUIArea = (clientX: number, clientY: number) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Bottom-right joystick area (80px + margin)
      const joystickArea = {
        left: screenWidth - 120,
        top: screenHeight - 120,
        right: screenWidth,
        bottom: screenHeight
      };
      
      // Bottom-left buttons area (4 buttons * 48px + gaps + margin)
      const buttonsArea = {
        left: 0,
        top: screenHeight - 220,
        right: 150,
        bottom: screenHeight
      };
      
      // Check if touch is in any UI area
      const inJoystick = clientX >= joystickArea.left && clientX <= joystickArea.right &&
                        clientY >= joystickArea.top && clientY <= joystickArea.bottom;
      
      const inButtons = clientX >= buttonsArea.left && clientX <= buttonsArea.right &&
                       clientY >= buttonsArea.top && clientY <= buttonsArea.bottom;
      
      return inJoystick || inButtons;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      
      // Don't handle camera if touch is in UI control areas
      if (isTouchInUIArea(touch.clientX, touch.clientY)) {
        return;
      }
      
      lastTouch.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      
      // Don't handle camera if touch is in UI control areas
      if (isTouchInUIArea(touch.clientX, touch.clientY)) {
        return;
      }
      
      const deltaX = (touch.clientX - lastTouch.current.x) * touchSensitivity;
      const deltaY = (touch.clientY - lastTouch.current.y) * touchSensitivity;
      
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
      
      lastTouch.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = () => {
      // Touch end handling if needed
    };

    // Add touch event listeners to the canvas
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, camera, gl]);

  // This component doesn't render anything - it just adds touch listeners
  return null;
};

export default MobileCameraControl; 