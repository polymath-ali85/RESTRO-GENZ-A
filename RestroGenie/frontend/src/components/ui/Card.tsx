import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white dark:bg-[#1E1C24] border border-[#E9E4F0] dark:border-[#312E3C] rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
        hoverable
          ? 'transition-all duration-200 hover:shadow-[0_8px_20px_rgba(197,163,255,0.12)] hover:border-[#C5A3FF]/40'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}> = ({ title, subtitle, action, icon }) => (
  <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-[#F0EBF7] dark:border-[#2C2936]">
    <div className="flex items-center gap-2.5">
      {icon && (
        <div className="p-2 rounded-lg bg-[#F5F0FF] dark:bg-[#2A2338] text-[#8654DE] dark:text-[#C5A3FF]">
          {icon}
        </div>
      )}
      <div>
        <h3 className="font-semibold text-base text-[#2D2D2D] dark:text-[#F5F3F8] tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-[#6F6A78] dark:text-[#A7A1B3] mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
