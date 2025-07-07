import { useEffect, useRef } from 'react';

export const usePreventScroll = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if it's a mobile device to avoid conflicts with mobile controls
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const element = elementRef.current;
    if (!element) return;

    const preventDefault = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleTouchStart = (e: TouchEvent) => {
      // On mobile, don't interfere with touch controls
      if (!isMobile) {
        e.stopPropagation();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // On mobile, don't prevent default to avoid conflicts with mobile controls
      if (!isMobile) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Add event listeners
    element.addEventListener('wheel', handleWheel, { passive: false });
    
    // Only add touch event listeners on non-mobile devices to avoid conflicts
    if (!isMobile) {
      element.addEventListener('touchstart', handleTouchStart, { passive: false });
      element.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    
    element.addEventListener('mousedown', preventDefault);
    element.addEventListener('mousemove', preventDefault);

    // Disable body scroll when mouse is over the element
    const handleMouseEnter = () => {
      document.body.style.overflow = 'hidden';
    };

    const handleMouseLeave = () => {
      document.body.style.overflow = 'auto';
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('wheel', handleWheel);
      
      // Only remove touch event listeners if they were added (non-mobile devices)
      if (!isMobile) {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
      }
      
      element.removeEventListener('mousedown', preventDefault);
      element.removeEventListener('mousemove', preventDefault);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      
      // Restore body scroll on cleanup
      document.body.style.overflow = 'auto';
    };
  }, []);

  return elementRef;
}; 