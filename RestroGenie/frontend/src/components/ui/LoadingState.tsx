import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  title?: string;
  subtitle?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Processing customer data...',
  subtitle = 'Parsing columns, running validation checks, and clustering segments',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl bg-white dark:bg-[#1E1C24] border border-[#E9E4F0] dark:border-[#312E3C] shadow-sm my-4">
      <div className="relative mb-5">
        <div className="w-14 h-14 rounded-2xl bg-[#F5F0FF] dark:bg-[#2A2338] flex items-center justify-center text-[#8654DE] dark:text-[#C5A3FF]">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
        <div className="absolute -inset-1 rounded-2xl bg-[#C5A3FF]/20 animate-ping -z-10" />
      </div>
      <h4 className="text-base font-semibold text-[#2D2D2D] dark:text-[#F5F3F8] mb-1">
        {title}
      </h4>
      <p className="text-xs text-[#6F6A78] dark:text-[#A7A1B3] max-w-sm">
        {subtitle}
      </p>
    </div>
  );
};
