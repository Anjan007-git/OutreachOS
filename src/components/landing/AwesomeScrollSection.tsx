import React from 'react';
import { motion } from 'motion/react';

interface AwesomeScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'scale' | 'left' | 'right';
  glowColor?: string;
}

export const AwesomeScrollSection: React.FC<AwesomeScrollSectionProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  glowColor = 'indigo',
}) => {
  const getInitial = () => {
    switch (direction) {
      case 'scale':
        return { opacity: 0, scale: 0.92, y: 30 };
      case 'left':
        return { opacity: 0, x: -50, y: 15 };
      case 'right':
        return { opacity: 0, x: 50, y: 15 };
      case 'up':
      default:
        return { opacity: 0, y: 45, scale: 0.97 };
    }
  };

  const getAnimate = () => {
    switch (direction) {
      case 'scale':
        return { opacity: 1, scale: 1, y: 0 };
      case 'left':
      case 'right':
        return { opacity: 1, x: 0, y: 0 };
      case 'up':
      default:
        return { opacity: 1, y: 0, scale: 1 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={getAnimate()}
      viewport={{ once: false, amount: 0.12, margin: '0px 0px -40px 0px' }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1], // snappy smooth cubic-bezier
      }}
      className={`relative ${className}`}
    >
      {/* Dynamic ambient backdrop aura in light mode only; hidden in dark mode to preserve pure black aesthetics */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 1, delay: delay + 0.1 }}
        className={`absolute inset-0 -z-10 pointer-events-none blur-3xl opacity-30 dark:hidden transition-opacity ${
          glowColor === 'indigo'
            ? 'bg-radial from-indigo-500/15 via-purple-500/5 to-transparent'
            : glowColor === 'emerald'
            ? 'bg-radial from-emerald-500/15 via-teal-500/5 to-transparent'
            : 'bg-radial from-cyan-500/15 via-blue-500/5 to-transparent'
        }`}
      />
      {children}
    </motion.div>
  );
};
