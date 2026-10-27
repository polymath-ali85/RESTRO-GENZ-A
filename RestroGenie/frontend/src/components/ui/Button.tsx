import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#C5A3FF]/50 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-[#2D2D2D] hover:bg-[#1F1F1F] text-white shadow-sm border border-[#2D2D2D] hover:border-black active:translate-y-[1px] dark:bg-[#C5A3FF] dark:hover:bg-[#B387FF] dark:text-[#18171B] dark:border-[#C5A3FF]',
    secondary:
      'bg-[#F5F0FF] hover:bg-[#EAE1FF] text-[#2D2D2D] border border-[#E9E4F0] dark:bg-[#2A2338] dark:hover:bg-[#342C46] dark:text-[#F3F0FA] dark:border-[#3D354E]',
    outline:
      'bg-transparent hover:bg-black/5 text-[#2D2D2D] border border-[#E9E4F0] dark:text-[#F5F3F8] dark:border-[#3B3844] dark:hover:bg-white/5',
    ghost:
      'bg-transparent hover:bg-black/5 text-[#6F6A78] hover:text-[#2D2D2D] dark:text-[#A7A1B3] dark:hover:text-[#F5F3F8] dark:hover:bg-white/5',
    danger:
      'bg-[#D94F5C] hover:bg-[#C8404E] text-white shadow-sm border border-[#D94F5C]',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
