import React from 'react';
import { Card } from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'error' | 'info' | 'lavender';
  };
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  badge,
  trend,
}) => {
  return (
    <Card hoverable className="relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6F6A78] dark:text-[#A7A1B3]">
            {title}
          </p>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#2D2D2D] dark:text-[#F5F3F8] mt-1.5 tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-[#6F6A78] dark:text-[#A7A1B3] mt-1">
              {subtitle}
            </p>
          )}
          {trend && (
            <p className="text-[11px] text-[#27845A] dark:text-[#52C98F] font-medium mt-1">
              {trend}
            </p>
          )}
        </div>
        <div className="p-3 rounded-xl bg-[#F5F0FF] dark:bg-[#2A2338] text-[#8654DE] dark:text-[#C5A3FF] shrink-0">
          {icon}
        </div>
      </div>
    </Card>
  );
};
