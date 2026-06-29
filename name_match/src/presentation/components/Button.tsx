import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const base =
    'w-full py-3 px-6 rounded-2xl font-bold text-base transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  const styles = {
    primary: 'bg-pink-400 hover:bg-pink-500 text-white shadow-md shadow-pink-200',
    secondary: 'bg-yellow-200 hover:bg-yellow-300 text-yellow-800 shadow-md shadow-yellow-100',
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
