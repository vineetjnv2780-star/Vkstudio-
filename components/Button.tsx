import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-4 overflow-hidden font-semibold transition-all duration-300 rounded-full group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 tracking-wide";
  
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-[0_4px_20px_rgba(124,58,237,0.4)] hover:shadow-[0_6px_25px_rgba(124,58,237,0.5)] border border-white/10",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 hover:border-white/20 shadow-lg",
    glass: "bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white shadow-xl hover:shadow-2xl",
    danger: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_4px_20px_rgba(225,29,72,0.4)]",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className} active:scale-[0.98]`}
      {...props}
    >
      {children}
    </button>
  );
};