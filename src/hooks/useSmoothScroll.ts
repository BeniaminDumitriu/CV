import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface SmoothScrollOptions {
  duration?: number;
  easing?: (t: number) => number;
}

export const useSmoothScroll = (options: SmoothScrollOptions = {}) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with premium settings
    lenisRef.current = new Lenis({
      duration: options.duration || 1.2,
      easing: options.easing || ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
    } as any);

    // Animation loop
    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  // Scroll to specific position
  const scrollTo = (target: string | number, options?: { offset?: number; duration?: number }) => {
    lenisRef.current?.scrollTo(target, {
      offset: options?.offset || 0,
      duration: options?.duration || 1.2,
    });
  };

  // Stop scrolling
  const stop = () => {
    lenisRef.current?.stop();
  };

  // Start scrolling
  const start = () => {
    lenisRef.current?.start();
  };

  return {
    lenis: lenisRef.current,
    scrollTo,
    stop,
    start,
  };
}; 