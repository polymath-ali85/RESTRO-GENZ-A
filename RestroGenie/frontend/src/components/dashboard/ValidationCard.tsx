import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import { ValidationChecks } from '../../types';
import { ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ValidationCardProps {
  checks: ValidationChecks;
  totalErrors: number;
}

export const ValidationCard: React.FC<ValidationCardProps> = ({ checks, totalErrors }) => {
  const checkItems = [
    {
      key: 'missing_required_rows',
      label: 'Missing Identity Fields (ID, Name, Phone, Consent)',
      count: checks.missing_required_rows,
    },
    {
      key: 'duplicate_id_rows',
      label: 'Duplicate Customer IDs',
      count: checks.duplicate_id_rows,
    },
    {
      key: 'invalid_consent_rows',
      label: 'Non-Standard Consent Values (Requires explicit "yes")',
      count: checks.invalid_consent_rows,
    },
    {
      key: 'invalid_total_orders_rows',
      label: 'Invalid Total Orders (<0 or non-integer)',
      count: checks.invalid_total_orders_rows,
    },
    {
      key: 'invalid_total_spend_rows',
      label: 'Negative Total Spend Anomalies',
      count: checks.invalid_total_spend_rows,
    },
    {
      key: 'invalid_avg_order_value_rows',
      label: 'Negative Average Order Value (<0)',
      count: checks.invalid_avg_order_value_rows,
    },
    {
      key: 'invalid_signup_date_rows',
      label: 'Invalid or Future Signup Dates',
      count: checks.invalid_signup_date_rows,
    },
    {
      key: 'invalid_last_order_date_rows',
      label: 'Invalid or Future Last Order Dates',
      count: checks.invalid_last_order_date_rows,
    },
    {
      key: 'last_order_before_signup_rows',
      label: 'Chronological Conflict (Last Order before Signup)',
      count: checks.last_order_before_signup_rows,
    },
  ];

  return (
    <Card>
      <CardHeader
        title="Data Quality & Compliance Auditing"
        subtitle={`Backend verification engine detected ${totalErrors} data anomalies`}
        icon={<ShieldCheck className="w-4 h-4" />}
        action={
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
              totalErrors === 0
                ? 'bg-[#EBF7F0] text-[#27845A] dark:bg-[#162D21] dark:text-[#52C98F]'
                : 'bg-[#FFF7EB] text-[#C08119] dark:bg-[#332512] dark:text-[#F0B758]'
            }`}
          >
            {totalErrors === 0 ? 'All Checks Passed' : `${totalErrors} Issues Flagged`}
          </span>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {checkItems.map((item) => {
          const isClean = item.count === 0;
          return (
            <div
              key={item.key}
              className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 transition-colors ${
                isClean
                  ? 'bg-[#FAF9FC] dark:bg-[#1A1820] border-[#E9E4F0] dark:border-[#2C2936]'
                  : 'bg-[#FFF9F9] dark:bg-[#2A1619] border-[#FBD6DA] dark:border-[#542127]'
              }`}
            >
              {isClean ? (
                <CheckCircle2 className="w-4 h-4 text-[#27845A] dark:text-[#52C98F] shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[#D94F5C] dark:text-[#F37B85] shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium text-[#2D2D2D] dark:text-[#E2DFE8] leading-tight">
                  {item.label}
                </p>
                <p
                  className={`mt-1 font-semibold ${
                    isClean
                      ? 'text-[#27845A] dark:text-[#52C98F]'
                      : 'text-[#D94F5C] dark:text-[#F37B85]'
                  }`}
                >
                  {isClean ? '0 flagged' : `${item.count} rows flagged`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
