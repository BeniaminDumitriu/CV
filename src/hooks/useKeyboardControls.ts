import { useEffect, useState } from 'react';

export interface KeyboardControls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  run: boolean;
  interact: boolean; // F key for interaction
  e: boolean; // E key for email
  l: boolean; // L key for linkedin
}

export const useKeyboardControls = (mobileControls?: any): KeyboardControls => {
  const [keys, setKeys] = useState<KeyboardControls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    run: false,
    interact: false,
    e: false,
    l: false,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.code.toLowerCase();
      switch (key) {
        case 'keyw':
          setKeys(prev => ({ ...prev, forward: true }));
          break;
        case 'keys':
          setKeys(prev => ({ ...prev, backward: true }));
          break;
        case 'keya':
          setKeys(prev => ({ ...prev, left: true }));
          break;
        case 'keyd':
          setKeys(prev => ({ ...prev, right: true }));
          break;
        case 'space':
          // Only prevent default on desktop to avoid page scroll
          if (!('ontouchstart' in window)) {
            event.preventDefault();
          }
          setKeys(prev => ({ ...prev, jump: true }));
          break;
        case 'shiftleft':
          setKeys(prev => ({ ...prev, run: true }));
          break;
        case 'keyf':
          setKeys(prev => ({ ...prev, interact: true }));
          break;
        case 'keye':
          setKeys(prev => ({ ...prev, e: true }));
          break;
        case 'keyl':
          setKeys(prev => ({ ...prev, l: true }));
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.code.toLowerCase();
      switch (key) {
        case 'keyw':
          setKeys(prev => ({ ...prev, forward: false }));
          break;
        case 'keys':
          setKeys(prev => ({ ...prev, backward: false }));
          break;
        case 'keya':
          setKeys(prev => ({ ...prev, left: false }));
          break;
        case 'keyd':
          setKeys(prev => ({ ...prev, right: false }));
          break;
        case 'space':
          setKeys(prev => ({ ...prev, jump: false }));
          break;
        case 'shiftleft':
          setKeys(prev => ({ ...prev, run: false }));
          break;
        case 'keyf':
          setKeys(prev => ({ ...prev, interact: false }));
          break;
        case 'keye':
          setKeys(prev => ({ ...prev, e: false }));
          break;
        case 'keyl':
          setKeys(prev => ({ ...prev, l: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Merge keyboard controls with mobile controls if provided
  if (mobileControls) {
    return {
      forward: keys.forward || mobileControls.forward,
      backward: keys.backward || mobileControls.backward,
      left: keys.left || mobileControls.left,
      right: keys.right || mobileControls.right,
      jump: keys.jump || mobileControls.jump,
      run: keys.run, // Run is keyboard only (Shift key)
      interact: keys.interact || mobileControls.interact,
      e: keys.e || mobileControls.e,
      l: keys.l || mobileControls.l,
    };
  }

  return keys;
}; 