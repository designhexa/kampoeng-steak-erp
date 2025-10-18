import React from 'react';
import clsx from 'clsx';

type BadgeVariant = 'default' | 'primary' | 'outline' | 'secondary' | 'destructive';

export const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }> = ({ children, className = '', variant = 'default', ...rest }) => {
  const base = 'inline-flex items-center px-2 py-1 text-xs rounded-full font-medium';
  const variantClass: Record<BadgeVariant, string> = {
    default: 'bg-blue-50 text-blue-700',
    primary: 'bg-[#163681] text-[#F8F102]',
    outline: 'bg-transparent border border-border text-[#163681]',
    secondary: 'bg-gray-100 text-[#163681]',
    destructive: 'bg-red-50 text-red-700'
  };

  return (
    <span className={clsx(base, variantClass[variant], className)} {...rest}>{children}</span>
  );
};
