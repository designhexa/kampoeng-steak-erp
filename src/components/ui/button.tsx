import React from 'react';
import clsx from 'clsx';

type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

export const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'default', size = 'md', loading = false, disabled, ...rest }) => {
  const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeClass = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }[size];

  const variantClass: Record<ButtonVariant, string> = {
    default: 'bg-[#163681] text-[#F8F102] hover:bg-[#163681]/90',
    outline: 'border border-border bg-transparent text-[#163681]',
    ghost: 'bg-transparent text-[#163681] hover:bg-blue-50',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    secondary: 'bg-gray-100 text-[#163681] hover:bg-gray-200'
  };

  return (
    <button
      className={clsx(base, sizeClass, variantClass[variant], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};
