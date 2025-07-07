import { useState, useEffect } from 'react';

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check for touch capability
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Check screen size - sm breakpoint is 640px in Tailwind
      const isMobileSize = window.innerWidth < 640;
      
      // Check user agent for mobile devices
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileUA = mobileRegex.test(navigator.userAgent);
      
      // Show mobile controls when screen is smaller than sm breakpoint OR touch device with small screen
      const mobile = isMobileSize || (hasTouch && window.innerWidth < 768);
      
      setIsMobile(mobile);
      setIsTouchDevice(hasTouch);
    };

    // Check initially
    checkMobile();

    // Listen for window resize
    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isMobile, isTouchDevice };
}; 