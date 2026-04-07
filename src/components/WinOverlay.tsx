import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';

interface WinOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

export const WinOverlay: React.FC<WinOverlayProps> = ({ isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Golden fireworks
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#FFD700', '#FFA500', '#FF8C00']
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#FFD700', '#FFA500', '#FF8C00']
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <div className="relative flex flex-col items-center">
            {/* Floating Khmer Text */}
            <motion.div
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ 
                scale: [1, 1.1, 1],
                y: [0, -20, 0],
                opacity: 1 
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-center"
            >
              <h2 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-700 font-headline drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]">
                ចូលឆ្នាំថ្មី
              </h2>
              <div className="mt-4 flex items-center justify-center gap-4 text-yellow-400">
                <Sparkles className="w-6 h-6 animate-pulse" />
                <span className="text-xl font-bold font-headline uppercase tracking-[0.5em]">Victory Sequence</span>
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
            </motion.div>

            {/* Decorative HUD Elements */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              className="h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent mt-8"
            />
            
            <button 
              onClick={onClose}
              className="mt-12 px-8 py-3 bg-yellow-500 text-black font-black rounded-full hover:bg-yellow-400 transition-colors uppercase tracking-widest text-sm"
            >
              បន្តបេសកកម្ម
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
