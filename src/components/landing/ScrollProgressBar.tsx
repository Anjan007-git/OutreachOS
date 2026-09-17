import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[70] pointer-events-none bg-transparent">
      <motion.div
        style={{ scaleX }}
        className="h-full w-full origin-left bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]"
      />
    </div>
  );
};
