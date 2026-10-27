import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import {
  PieChart,
  Flame,
  Crown,
  Moon,
  Sparkles,
  Heart,
  UserCheck,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SegmentDefinition {
  name: string;
  icon: React.ReactNode;
  rule: string;
  description: string;
  recommendedAngle: string;
  colorClass: string;
}

const SEGMENT_DEFS: SegmentDefinition[] = [
  {
    name: 'Frequent',
    icon: <Flame className="w-5 h-5 text-amber-500" />,
    rule: 'total_orders >= 5',
    description: 'Highly engaged diners with repeat visits to your restaurant.',
    recommendedAngle: 'Playful familiarity and exclusive chef appreciation jokes.',
    colorClass: 'border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20',
  },
  {
    name: 'High Spender',
    icon: <Crown className="w-5 h-5 text-[#8654DE] dark:text-[#C5A3FF]" />,
    rule: 'total_spend >= 75th percentile within currency',
    description: 'Top revenue contributors within their respective currency bracket.',
    recommendedAngle: 'Royal treatment, premium dish shoutouts, and VIP acknowledgment.',
    colorClass: 'border-[#E2D5FC] dark:border-[#43375B] bg-[#F5F0FF]/40 dark:bg-[#2A2338]/30',
  },
  {
    name: 'Inactive',
    icon: <Moon className="w-5 h-5 text-blue-500" />,
    rule: 'days_since_last_order > 90 days',
    description: 'Past diners who haven’t visited or ordered in over 3 months.',
    recommendedAngle: 'Lighthearted reconnection asking if their favorite dish was missed.',
    colorClass: 'border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/20',
  },
  {
    name: 'New Customer',
    icon: <Sparkles className="w-5 h-5 text-emerald-500" />,
    rule: 'signup_date within last 30 days',
    description: 'Recent registrations ready to form strong dining habits.',
    recommendedAngle: 'Warm Hinglish welcome inviting them for their second experience.',
    colorClass: 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/20',
  },
  {
    name: 'Favorite Item Known',
    icon: <Heart className="w-5 h-5 text-rose-500" />,
    rule: 'favorite_item is specified and non-empty',
    description: 'Customers with clear food preference recorded in customer data.',
    recommendedAngle: 'Direct cravings trigger centered on their favorite dish.',
    colorClass: 'border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20',
  },
  {
    name: 'Regular',
    icon: <UserCheck className="w-5 h-5 text-slate-500" />,
    rule: 'Standard baseline (no special criteria met)',
    description: 'Steady customer base receiving general brand promotions.',
    recommendedAngle: 'Friendly weekend food jokes and relaxed invitations.',
    colorClass: 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20',
  },
];

export const SegmentsPage: React.FC = () => {
  const { uploadData, customerRecords, loadSampleData } = useApp();
  const [selectedSegment, setSelectedSegment] = useState<string>('Frequent');
  const navigate = useNavigate();

  if (!uploadData) {
    return (
      <EmptyState
        icon={<PieChart className="w-8 h-8" />}
        title="No Segmentation Data Available"
        description="Customer segmentation is calculated automatically from your uploaded CSV based on the business rules in services/segmentation.py."
        actionText="Load Sample Dataset"
        onAction={loadSampleData}
      />
    );
  }

  const segmentCounts = uploadData.segment_counts;

  // Filter customers matching selectedSegment
  const matchingCustomers = customerRecords.filter((c) => {
    if (selectedSegment === 'Regular') {
      return c.segments?.includes('Regular');
    }
    return c.segments?.includes(selectedSegment);
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white dark:bg-[#1E1C24] p-5 rounded-2xl border border-[#E9E4F0] dark:border-[#312E3C] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#2D2D2D] dark:text-[#F5F3F8]">
              Cohort Classification Engine
            </h2>
            <Badge variant="lavender" size="sm">
              services/segmentation.py
            </Badge>
          </div>
          <p className="text-xs text-[#6F6A78] dark:text-[#A7A1B3] mt-1">
            Customers are grouped according to order frequency, recency, spend quantiles, and food preferences.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/messages')}
          icon={<Sparkles className="w-3.5 h-3.5" />}
        >
          Generate Segment Messages
        </Button>
      </div>

      {/* Segment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SEGMENT_DEFS.map((seg) => {
          const count = segmentCounts[seg.name] || 0;
          const isSelected = selectedSegment === seg.name;

          return (
            <div
              key={seg.name}
              onClick={() => setSelectedSegment(seg.name)}
              className={`p-5 rounded-xl border transition-all duration-150 cursor-pointer text-left select-none ${
                seg.colorClass
              } ${
                isSelected
                  ? 'ring-2 ring-[#8654DE] dark:ring-[#C5A3FF] shadow-md scale-[1.01]'
                  : 'hover:shadow-sm hover:border-[#C5A3FF]/60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#1F1D24] shadow-xs">
                  {seg.icon}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#2D2D2D] dark:text-[#F5F3F8] tracking-tight">
                    {count}
                  </span>
                  <span className="block text-[10px] uppercase font-bold text-[#6F6A78] dark:text-[#A7A1B3]">
                    Eligible Diners
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-[#2D2D2D] dark:text-[#F5F3F8] mt-3">
                {seg.name}
              </h3>
              <p className="text-xs text-[#6F6A78] dark:text-[#A7A1B3] mt-1 line-clamp-2">
                {seg.description}
              </p>

              <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 space-y-1.5 text-[11px]">
                <div className="text-[#6F6A78] dark:text-[#A7A1B3]">
                  <strong>Rule:</strong> <code className="font-mono text-[10px]">{seg.rule}</code>
                </div>
                <div className="text-[#6939C4] dark:text-[#C5A3FF] font-medium">
                  <strong>Angle:</strong> {seg.recommendedAngle}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Segment Customer Table Preview */}
      <Card>
        <CardHeader
          title={`Auditing: ${selectedSegment} Segment (${matchingCustomers.length} Diners)`}
          subtitle={`Showing customers matching the "${selectedSegment}" criteria`}
          icon={<UserCheck className="w-4 h-4" />}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/messages')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Compose Draft for {selectedSegment}
            </Button>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9FC] dark:bg-[#16141B] text-[#6F6A78] dark:text-[#A7A1B3] uppercase text-[10px] font-bold border-b border-[#F0EBF7] dark:border-[#2C2936]">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Favorite Dish</th>
                <th className="p-3">Total Orders</th>
                <th className="p-3">Total Spend</th>
                <th className="p-3">Last Order Date</th>
                <th className="p-3">All Segments</th>
                <th className="p-3">Consent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBF7] dark:divide-[#2C2936]">
              {matchingCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-[#6F6A78]">
                    No customers found in this segment.
                  </td>
                </tr>
              ) : (
                matchingCustomers.slice(0, 10).map((c) => (
                  <tr key={c.customer_id} className="hover:bg-black/2 dark:hover:bg-white/2">
                    <td className="p-3">
                      <span className="font-semibold text-[#2D2D2D] dark:text-[#F5F3F8]">
                        {c.first_name} {c.last_name}
                      </span>
                      <span className="block text-[11px] font-mono text-[#6F6A78] dark:text-[#A7A1B3]">
                        {c.customer_id}
                      </span>
                    </td>
                    <td className="p-3 text-[#2D2D2D] dark:text-[#E2DFE8]">
                      {c.favorite_item || '—'}
                    </td>
                    <td className="p-3 font-semibold">{c.total_orders}</td>
                    <td className="p-3 font-semibold">
                      {c.currency} {c.total_spend.toFixed(2)}
                    </td>
                    <td className="p-3 font-mono text-[#6F6A78] dark:text-[#A7A1B3]">
                      {c.last_order_date || '—'}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {c.segments?.map((s) => (
                          <Badge key={s} variant="lavender" size="sm">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge size="sm" variant={c.marketing_eligible ? 'success' : 'neutral'}>
                        {c.marketing_opt_in.toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
