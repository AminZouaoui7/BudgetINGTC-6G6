import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'motion/react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  icon?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#0879bf] text-white hover:bg-[#065d93] shadow-sm hover:shadow-md',
    secondary: 'bg-[#3eb3f2] text-white hover:bg-[#2a9fe0] shadow-sm hover:shadow-md',
    outline: 'border-2 border-[#bce3fb] text-[#0879bf] hover:bg-[#f0f8ff] hover:border-[#81cdf8]',
    ghost: 'text-[#0879bf] hover:bg-[#f0f8ff]',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </motion.button>
  );
}
