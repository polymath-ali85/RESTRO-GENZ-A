import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { Card, CardHeader } from '../ui/Card';
import { PieChart as PieIcon, BarChart2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SegmentChartProps {
  segmentCounts: Record<string, number>;
  eligibleCount: number;
  notEligibleCount: number;
}

const SEGMENT_COLORS = [
  '#C5A3FF', // Lavender Mist
  '#9F72F5', // Deep Lavender
  '#2D2D2D', // Charcoal
  '#6286D8', // Info Blue
  '#D69A32', // Warning Amber
  '#27845A', // Success Green
];

export const SegmentChart: React.FC<SegmentChartProps> = ({
  segmentCounts,
  eligibleCount,
  notEligibleCount,
}) => {
  const { isDark } = useTheme();

  const barData = Object.entries(segmentCounts).map(([name, count]) => ({
    name,
    count,
  }));

  const pieData = [
    { name: 'Eligible (Consent + Valid)', value: eligibleCount, color: '#27845A' },
    { name: 'Ineligible (Opt-out / Error)', value: notEligibleCount, color: '#D94F5C' },
  ];

  const tooltipBg = isDark ? '#1F1D24' : '#FFFFFF';
  const tooltipText = isDark ? '#F5F3F8' : '#2D2D2D';
  const tooltipBorder = isDark ? '#312E3C' : '#E9E4F0';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Segment Breakdown Bar Chart */}
      <Card className="lg:col-span-2">
        <CardHeader
          title="Customer Segment Distribution"
          subtitle="Count of eligible customers categorized across marketing behavioral rules"
          icon={<BarChart2 className="w-4 h-4" />}
        />
        <div className="h-64 w-full mt-2">
          {barData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-[#6F6A78]">
              No segment data available yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: isDark ? '#A7A1B3' : '#6F6A78', fontSize: 11 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fill: isDark ? '#A7A1B3' : '#6F6A78', fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    color: tooltipText,
                    borderColor: tooltipBorder,
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {barData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Consent & Marketing Eligibility Donut */}
      <Card>
        <CardHeader
          title="Marketing Consent Status"
          subtitle="Strict validation & explicit opt-in ratio"
          icon={<PieIcon className="w-4 h-4" />}
        />
        <div className="h-52 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`pie-cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  color: tooltipText,
                  borderColor: tooltipBorder,
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-[#2D2D2D] dark:text-[#F5F3F8]">
              {eligibleCount + notEligibleCount > 0
                ? `${Math.round((eligibleCount / (eligibleCount + notEligibleCount)) * 100)}%`
                : '0%'}
            </span>
            <span className="text-[10px] uppercase font-semibold text-[#6F6A78] dark:text-[#A7A1B3]">
              Eligible
            </span>
          </div>
        </div>

        <div className="mt-2 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[#6F6A78] dark:text-[#A7A1B3]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#27845A]" />
              Eligible (Opt-In & Clean)
            </span>
            <span className="font-semibold text-[#2D2D2D] dark:text-[#F5F3F8]">
              {eligibleCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[#6F6A78] dark:text-[#A7A1B3]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D94F5C]" />
              Ineligible (Opt-Out / Error)
            </span>
            <span className="font-semibold text-[#2D2D2D] dark:text-[#F5F3F8]">
              {notEligibleCount}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
