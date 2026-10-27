import React, { useState, useMemo } from 'react';
import { CustomerRecord } from '../../types';
import { Badge } from '../ui/Badge';
import { Card, CardHeader } from '../ui/Card';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface CustomerTableProps {
  customers: CustomerRecord[];
}

export const CustomerTable: React.FC<CustomerTableProps> = ({ customers }) => {
  const [search, setSearch] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string>('All');
  const [eligibilityFilter, setEligibilityFilter] = useState<'All' | 'Eligible' | 'Issues'>('All');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      // 1. Search text
      const term = search.toLowerCase();
      const matchesSearch =
        !term ||
        c.customer_id.toLowerCase().includes(term) ||
        c.first_name.toLowerCase().includes(term) ||
        c.last_name.toLowerCase().includes(term) ||
        c.city.toLowerCase().includes(term) ||
        c.phone_test_only.includes(term);

      if (!matchesSearch) return false;

      // 2. Segment filter
      if (segmentFilter !== 'All') {
        if (!c.segments || !c.segments.includes(segmentFilter)) {
          return false;
        }
      }

      // 3. Eligibility filter
      if (eligibilityFilter === 'Eligible' && !c.marketing_eligible) return false;
      if (eligibilityFilter === 'Issues' && !c.has_data_error) return false;

      return true;
    });
  }, [customers, search, segmentFilter, eligibilityFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const currentRecords = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Card className="p-0 overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 bg-white dark:bg-[#1E1C24] border-b border-[#F0EBF7] dark:border-[#2C2936] flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#6F6A78] dark:text-[#A7A1B3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by ID, name, city..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF9FC] dark:bg-[#16141B] border border-[#E9E4F0] dark:border-[#383345] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A3FF]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#6F6A78] dark:text-[#A7A1B3]">
            <Filter className="w-3.5 h-3.5" />
            <span>Segment:</span>
            <select
              value={segmentFilter}
              onChange={(e) => {
                setSegmentFilter(e.target.value);
                setPage(1);
              }}
              className="px-2 py-1 bg-[#FAF9FC] dark:bg-[#16141B] border border-[#E9E4F0] dark:border-[#383345] rounded-md text-xs font-medium focus:outline-hidden"
            >
              <option value="All">All Segments</option>
              <option value="Frequent">Frequent</option>
              <option value="High Spender">High Spender</option>
              <option value="Inactive">Inactive</option>
              <option value="New Customer">New Customer</option>
              <option value="Regular">Regular</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#6F6A78] dark:text-[#A7A1B3]">
            <span>Status:</span>
            <select
              value={eligibilityFilter}
              onChange={(e) => {
                setEligibilityFilter(e.target.value as 'All' | 'Eligible' | 'Issues');
                setPage(1);
              }}
              className="px-2 py-1 bg-[#FAF9FC] dark:bg-[#16141B] border border-[#E9E4F0] dark:border-[#383345] rounded-md text-xs font-medium focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Eligible">Only Eligible (Opt-in)</option>
              <option value="Issues">Only Issues</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Records Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF9FC] dark:bg-[#16141B] text-[#6F6A78] dark:text-[#A7A1B3] uppercase text-[10px] font-bold border-b border-[#F0EBF7] dark:border-[#2C2936]">
            <tr>
              <th className="p-3">Customer ID</th>
              <th className="p-3">Customer Name</th>
              <th className="p-3">City / Country</th>
              <th className="p-3">Favorite Dish</th>
              <th className="p-3">Orders & Spend</th>
              <th className="p-3">Segments</th>
              <th className="p-3">Channel / Consent</th>
              <th className="p-3">Eligibility</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EBF7] dark:divide-[#2C2936]">
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-[#6F6A78]">
                  No customers found matching search and filters.
                </td>
              </tr>
            ) : (
              currentRecords.map((c) => (
                <tr
                  key={c.customer_id}
                  className="hover:bg-black/2 dark:hover:bg-white/2 transition-colors"
                >
                  <td className="p-3 font-mono font-semibold text-[#8654DE] dark:text-[#C5A3FF]">
                    {c.customer_id}
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-[#2D2D2D] dark:text-[#F5F3F8]">
                      {c.first_name} {c.last_name}
                    </p>
                    <p className="text-[11px] text-[#6F6A78] dark:text-[#A7A1B3] font-mono">
                      {c.phone_test_only}
                    </p>
                  </td>
                  <td className="p-3 text-[#2D2D2D] dark:text-[#E2DFE8]">
                    {c.city}, {c.country}
                  </td>
                  <td className="p-3 text-[#2D2D2D] dark:text-[#E2DFE8]">
                    {c.favorite_item || '—'}
                  </td>
                  <td className="p-3">
                    <span className="font-semibold">{c.total_orders} orders</span>
                    <span className="text-[#6F6A78] dark:text-[#A7A1B3] block text-[11px]">
                      {c.currency} {c.total_spend.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {c.segments?.map((seg) => (
                        <Badge key={seg} variant="lavender" size="sm">
                          {seg}
                        </Badge>
                      )) || <Badge size="sm">Regular</Badge>}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-[#2D2D2D] dark:text-[#E2DFE8]">
                        {c.preferred_channel}
                      </span>
                      <Badge
                        size="sm"
                        variant={c.marketing_opt_in === 'yes' ? 'success' : 'neutral'}
                      >
                        {c.marketing_opt_in.toUpperCase()}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-3">
                    {c.marketing_eligible ? (
                      <span className="inline-flex items-center gap-1 text-[#27845A] dark:text-[#52C98F] font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Eligible
                      </span>
                    ) : c.has_data_error ? (
                      <span
                        className="inline-flex items-center gap-1 text-[#D94F5C] dark:text-[#F37B85] font-semibold text-[11px]"
                        title={c.validation_issues?.join(', ')}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Data Issue
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[#6F6A78] dark:text-[#A7A1B3] text-[11px]">
                        Opted Out
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-white dark:bg-[#1E1C24] border-t border-[#F0EBF7] dark:border-[#2C2936] flex items-center justify-between text-xs text-[#6F6A78] dark:text-[#A7A1B3]">
        <span>
          Showing {(page - 1) * pageSize + 1} to{' '}
          {Math.min(page * pageSize, filtered.length)} of {filtered.length} customers
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1 rounded border border-[#E9E4F0] dark:border-[#383345] disabled:opacity-40 cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-[#2D2D2D] dark:text-[#F5F3F8]">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1 rounded border border-[#E9E4F0] dark:border-[#383345] disabled:opacity-40 cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};
