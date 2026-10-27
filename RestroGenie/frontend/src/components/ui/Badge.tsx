import React from 'react';

export type BadgeVariant =
  | 'lavender'
  | 'charcoal'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
}) => {
  const variantStyles = {
    lavender:
      'bg-[#F5F0FF] text-[#7042C9] border-[#E2D5FC] dark:bg-[#2A2338] dark:text-[#C5A3FF] dark:border-[#43375B]',
    charcoal:
      'bg-[#2D2D2D] text-white border-[#2D2D2D] dark:bg-[#F3F0FA] dark:text-[#2D2D2D] dark:border-[#F3F0FA]',
    success:
      'bg-[#EBF7F0] text-[#27845A] border-[#C8EDD7] dark:bg-[#162D21] dark:text-[#52C98F] dark:border-[#224A35]',
    warning:
      'bg-[#FFF7EB] text-[#C08119] border-[#FCE2B8] dark:bg-[#332512] dark:text-[#F0B758] dark:border-[#523A1B]',
    error:
      'bg-[#FDF0F1] text-[#D94F5C] border-[#F7CDD1] dark:bg-[#341619] dark:text-[#F37B85] dark:border-[#542127]',
    info:
      'bg-[#EFF4FC] text-[#3E6ECF] border-[#CFDEF9] dark:bg-[#17243C] dark:text-[#7EA7F5] dark:border-[#273B61]',
    neutral:
      'bg-[#F5F4F7] text-[#6F6A78] border-[#E5E2EA] dark:bg-[#26242C] dark:text-[#A7A1B3] dark:border-[#3A3742]',
  }[variant];

  const sizeStyles = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-md border tracking-wide select-none ${variantStyles} ${sizeStyles} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
