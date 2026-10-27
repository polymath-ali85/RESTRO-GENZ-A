import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  badge?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  badge,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[#E0D7ED] dark:border-[#383345] rounded-2xl bg-[#FCFBFE] dark:bg-[#1A1820]/50 my-4">
      {badge && (
        <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F5F0FF] text-[#7042C9] dark:bg-[#2A2338] dark:text-[#C5A3FF] mb-4">
          {badge}
        </span>
      )}
      <div className="p-4 rounded-2xl bg-[#F5F0FF] dark:bg-[#2A2338] text-[#8654DE] dark:text-[#C5A3FF] mb-4 shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[#2D2D2D] dark:text-[#F5F3F8] mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-[#6F6A78] dark:text-[#A7A1B3] max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionText && onAction && (
          <Button variant="primary" onClick={onAction}>
            {actionText}
          </Button>
        )}
        {secondaryActionText && onSecondaryAction && (
          <Button variant="secondary" onClick={onSecondaryAction}>
            {secondaryActionText}
          </Button>
        )}
      </div>
    </div>
  );
};
