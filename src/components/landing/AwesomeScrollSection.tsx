import React, { useEffect, useRef, useState } from 'react';

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
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // 1. Respect prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setIsRevealed(true);
        return;
      }
    }

    const element = ref.current;
    if (!element) return;

    // 2. If already visible or above the viewport on mount, reveal immediately
    const rect = element.getBoundingClientRect();
    if (rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.92) {
      setIsRevealed(true);
      return;
    }

    // 3. One-way IntersectionObserver: triggers once on scroll DOWN, NEVER on scroll UP
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect(); // Permanently disconnect: never reverses, never refades, never replays!
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const getInitialTransform = () => {
    switch (direction) {
      case 'scale':
        return 'scale(0.985) translateY(24px)';
      case 'left':
        return 'translateX(-24px)';
      case 'right':
        return 'translateX(24px)';
      case 'up':
      default:
        return 'translateY(24px)';
    }
  };

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? 'translateY(0) translateX(0) scale(1)' : getInitialTransform(),
        transition: `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: isRevealed ? 'auto' : 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
};
