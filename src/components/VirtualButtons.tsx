import React from 'react';

interface VirtualButtonsProps {
  onButtonPress: (button: 'jump' | 'interact' | 'e' | 'l', pressed: boolean) => void;
  buttonStates: {
    jump: boolean;
    interact: boolean;
    e: boolean;
    l: boolean;
  };
}

const VirtualButtons: React.FC<VirtualButtonsProps> = ({ onButtonPress, buttonStates }) => {
  const buttons = [
    { key: 'interact' as const, label: 'F', description: 'Interact' },
    { key: 'e' as const, label: 'E', description: 'Email' },
    { key: 'l' as const, label: 'L', description: 'LinkedIn' },
    { key: 'jump' as const, label: '↑', description: 'Jump' },
  ];

  return (
    <div className="fixed bottom-8 left-8 flex flex-col gap-3 z-50">
      {buttons.map((button, index) => (
        <button
          key={button.key}
          className={`
            w-12 h-12 rounded-full font-bold text-sm border-2 border-white/20 
            touch-none select-none transition-all duration-150
            ${buttonStates[button.key] 
              ? 'bg-blue-500/90 text-white scale-110 shadow-lg shadow-blue-500/50' 
              : 'bg-black/40 text-white/90 hover:bg-black/60'
            }
          `}
          style={{
            background: buttonStates[button.key] 
              ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
              : 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: buttonStates[button.key]
              ? '0 8px 24px rgba(59, 130, 246, 0.4), inset 0 1px 2px rgba(255,255,255,0.3)'
              : '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)',
          }}
                     onTouchStart={(e) => {
             onButtonPress(button.key, true);
           }}
           onTouchEnd={(e) => {
             onButtonPress(button.key, false);
           }}
           onTouchCancel={(e) => {
             onButtonPress(button.key, false);
           }}
        >
          <div className="flex flex-col items-center">
            <span className="text-lg leading-none">{button.label}</span>
          </div>
        </button>
      ))}
      
      {/* Label */}
      <div className="text-white/60 text-xs font-mono text-center mt-1">
        ACTIONS
      </div>
    </div>
  );
};

export default VirtualButtons; 