import { CustomerRecord } from '../types';

export const ALL_SEGMENT_NAMES = [
  'Frequent',
  'High Spender',
  'Inactive',
  'New Customer',
  'Favorite Item Known',
  'Regular',
] as const;

export type SegmentName = typeof ALL_SEGMENT_NAMES[number];

export function addCustomerSegments(records: CustomerRecord[]): {
  records: CustomerRecord[];
  segmentCounts: Record<string, number>;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Group by currency for high-spender threshold (quantile 0.75)
  const spendsByCurrency: Record<string, number[]> = {};
  records.forEach((rec) => {
    if (rec.currency && !isNaN(rec.total_spend) && rec.total_spend >= 0) {
      if (!spendsByCurrency[rec.currency]) {
        spendsByCurrency[rec.currency] = [];
      }
      spendsByCurrency[rec.currency].push(rec.total_spend);
    }
  });

  const currencyThresholds: Record<string, number> = {};
  Object.entries(spendsByCurrency).forEach(([curr, values]) => {
    if (values.length >= 4) {
      const sorted = [...values].sort((a, b) => a - b);
      const qIndex = (sorted.length - 1) * 0.75;
      const lower = Math.floor(qIndex);
      const upper = Math.ceil(qIndex);
      const weight = qIndex - lower;
      const threshold = sorted[lower] * (1 - weight) + sorted[upper] * weight;
      currencyThresholds[curr] = threshold;
    }
  });

  const segmentCounts: Record<string, number> = {
    Frequent: 0,
    'High Spender': 0,
    Inactive: 0,
    'New Customer': 0,
    'Favorite Item Known': 0,
    Regular: 0,
  };

  const processedRecords = records.map((rec) => {
    const labels: string[] = [];

    // Frequent: >= 5 orders
    const isFrequent = rec.total_orders >= 5;
    if (isFrequent) {
      labels.push('Frequent');
    }

    // Inactive: last order > 90 days ago
    let isInactive = false;
    if (rec.last_order_date) {
      const orderDate = new Date(rec.last_order_date);
      orderDate.setHours(0, 0, 0, 0);
      if (!isNaN(orderDate.getTime())) {
        const diffDays = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 90) {
          isInactive = true;
          labels.push('Inactive');
        }
      }
    }

    // New Customer: signed up in last 30 days
    let isNew = false;
    if (rec.signup_date) {
      const signupDate = new Date(rec.signup_date);
      signupDate.setHours(0, 0, 0, 0);
      if (!isNaN(signupDate.getTime())) {
        const diffDays = Math.floor((today.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 30) {
          isNew = true;
          labels.push('New Customer');
        }
      }
    }

    // High Spender: top 25% within currency
    const threshold = rec.currency ? currencyThresholds[rec.currency] : undefined;
    const isHighSpender = threshold !== undefined && rec.total_spend >= threshold;
    if (isHighSpender) {
      labels.push('High Spender');
    }

    // Favorite Item Known
    const hasFavorite = Boolean(rec.favorite_item && rec.favorite_item.trim().length > 0);
    if (hasFavorite) {
      labels.push('Favorite Item Known');
    }

    // Regular: if no labels match
    if (labels.length === 0) {
      labels.push('Regular');
    }

    // Increment eligible segment counts if marketing_eligible
    if (rec.marketing_eligible) {
      labels.forEach((label) => {
        segmentCounts[label] = (segmentCounts[label] || 0) + 1;
      });
    }

    return {
      ...rec,
      segments: labels,
    };
  });

  return {
    records: processedRecords,
    segmentCounts,
  };
}
