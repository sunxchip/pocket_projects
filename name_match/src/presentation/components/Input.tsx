import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-bold text-pink-500">{label}</label>
      )}
      <input
        className={`w-full px-4 py-3 rounded-2xl border-2 border-pink-200 bg-white focus:outline-none focus:border-pink-400 text-gray-700 placeholder-pink-200 transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}
