import { useEffect, useRef } from 'react';

export const usePreventScroll = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      e.stopPropagation();
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Add event listeners
    element.addEventListener('wheel', handleWheel, { passive: false });
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
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
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
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