import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-md';
  
  const variants = {
    primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 focus:ring-[var(--color-primary)]',
    secondary: 'bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-hover)] focus:ring-[var(--color-secondary)]',
    outline: 'border border-[var(--color-border)] bg-transparent text-[var(--color-text-neutral)] hover:bg-gray-50 focus:ring-gray-200',
    ghost: 'bg-transparent text-[var(--color-text-neutral)] hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-200'
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg'
  };

  const styleString = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  // Since we are not using Tailwind, we'll map these to vanilla CSS classes or just use inline styles if needed, 
  // but to keep it simple and clean, let's write a small dedicated CSS for UI components or use standard inline-flex classes.
  // Wait, I used some tailwind-like utility classes here. Let me use pure vanilla CSS approach.
  
  return (
    <button className={`btn btn-${variant} btn-${size} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
