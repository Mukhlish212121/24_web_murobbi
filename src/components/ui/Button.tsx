import React from 'react';

// 1. Tambahkan 'size' ke dalam ButtonProps agar tidak error
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  children, 
  isLoading, 
  variant = 'primary', 
  size = 'md', // Default ukuran diset ke 'md' (menengah)
  className = '', 
  ...props 
}: ButtonProps) {
  // 2. Hapus padding (px-4 py-2) dari baseStyle agar bisa dikontrol oleh 'size'
  const baseStyle = "flex justify-center items-center rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-pondok-600 text-white hover:bg-pondok-700 dark:bg-pondok-500 dark:hover:bg-pondok-600",
    outline: "border-2 border-pondok-600 text-pondok-600 hover:bg-pondok-50 dark:border-pondok-400 dark:text-pondok-400 dark:hover:bg-pondok-900",
    ghost: "text-pondok-600 hover:bg-pondok-100 dark:text-pondok-400 dark:hover:bg-pondok-800"
  };

  // 3. Tambahkan pengaturan ukuran (padding dan ukuran teks)
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
}