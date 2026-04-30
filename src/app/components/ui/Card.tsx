import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export function Card({ children, className = '', hover = false, glass = false }: CardProps) {
  const Component = hover ? motion.div : 'div';

  const baseStyles = 'bg-white rounded-xl shadow-sm border border-[#bce3fb]/30';
  const glassStyles = glass ? 'backdrop-blur-sm bg-white/80' : '';
  const hoverProps = hover ? {
    whileHover: { scale: 1.02, boxShadow: '0 10px 30px rgba(8, 121, 191, 0.1)' },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      className={`${baseStyles} ${glassStyles} ${className}`}
      {...hoverProps}
    >
      {children}
    </Component>
  );
}
