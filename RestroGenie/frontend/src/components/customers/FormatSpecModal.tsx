import React from 'react';
import { Modal } from '../ui/Modal';
import { REQUIRED_COLUMNS } from '../../utils/csvParser';
import { Badge } from '../ui/Badge';

interface FormatSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormatSpecModal: React.FC<FormatSpecModalProps> = ({ isOpen, onClose }) => {
  const columnSpecs: {
    name: string;
    type: string;
    required: boolean;
    description: string;
    example: string;
  }[] = [
    {
      name: 'customer_id',
      type: 'String',
      required: true,
      description: 'Unique customer identifier. Duplicates are flagged.',
      example: 'RG0001',
    },
    {
      name: 'first_name',
      type: 'String',
      required: true,
      description: 'Customer given name used for AI personalization.',
      example: 'Milan',
    },
    {
      name: 'last_name',
      type: 'String',
      required: false,
      description: 'Customer surname or family name.',
      example: 'Moore',
    },
    {
      name: 'country',
      type: 'String',
      required: false,
      description: 'Customer country of residence.',
      example: 'United States',
    },
    {
      name: 'city',
      type: 'String',
      required: false,
      description: 'Customer home city.',
      example: 'New York',
    },
    {
      name: 'phone_test_only',
      type: 'String',
      required: true,
      description: 'Contact phone number (required for marketing eligibility).',
      example: '+1-202-555-0100',
    },
    {
      name: 'email_test_only',
      type: 'String',
      required: false,
      description: 'Email address for newsletter and notifications.',
      example: 'milan.moore@example.com',
    },
    {
      name: 'signup_date',
      type: 'Date (YYYY-MM-DD)',
      required: true,
      description: 'Account registration date (used for "New Customer" cohort).',
      example: '2024-05-03',
    },
    {
      name: 'last_order_date',
      type: 'Date (YYYY-MM-DD)',
      required: true,
      description: 'Most recent purchase (used for "Inactive" >90d rule).',
      example: '2026-07-15',
    },
    {
      name: 'total_orders',
      type: 'Integer (>= 0)',
      required: true,
      description: 'Cumulative order count (>= 5 qualifies as "Frequent").',
      example: '5',
    },
    {
      name: 'total_spend',
      type: 'Float (>= 0)',
      required: true,
      description: 'Total revenue from customer (75th percentile = "High Spender").',
      example: '97.77',
    },
    {
      name: 'currency',
      type: 'String (USD, EUR...)',
      required: true,
      description: 'Currency code for spend normalization.',
      example: 'USD',
    },
    {
      name: 'favorite_item',
      type: 'String',
      required: false,
      description: 'Top dish name injected into Hinglish AI prompts.',
      example: 'Chocolate Brownie',
    },
    {
      name: 'last_order_item',
      type: 'String',
      required: false,
      description: 'Item purchased in last order transaction.',
      example: 'Chocolate Brownie',
    },
    {
      name: 'avg_order_value',
      type: 'Float (>= 0)',
      required: true,
      description: 'Average ticket price per order.',
      example: '21.64',
    },
    {
      name: 'marketing_opt_in',
      type: '"yes" | "no"',
      required: true,
      description: 'Marketing consent flag. Only explicit "yes" is eligible.',
      example: 'yes',
    },
    {
      name: 'preferred_channel',
      type: 'WhatsApp | Email | Sms',
      required: true,
      description: 'Preferred customer communication channel.',
      example: 'WhatsApp',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Backend CSV Schema Contract"
      subtitle="Strict specification required by RestroGenie's services/csv_loader.py"
      maxWidth="4xl"
    >
      <div className="space-y-4 text-xs">
        <p className="text-[#6F6A78] dark:text-[#A7A1B3] leading-relaxed">
          The backend expects exactly these 17 normalized column headers. Column names are
          case-insensitive and spaces are automatically converted to underscores by{' '}
          <code>csv_loader.py</code>.
        </p>

        <div className="overflow-x-auto border border-[#E9E4F0] dark:border-[#312E3C] rounded-xl">
          <table className="w-full text-left">
            <thead className="bg-[#FAF9FC] dark:bg-[#1A1820] text-[#6F6A78] dark:text-[#A7A1B3] uppercase text-[10px] font-bold border-b border-[#E9E4F0] dark:border-[#312E3C]">
              <tr>
                <th className="p-3">Column Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Required</th>
                <th className="p-3">Description</th>
                <th className="p-3">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBF7] dark:divide-[#2C2936]">
              {columnSpecs.map((col) => (
                <tr key={col.name} className="hover:bg-black/2 dark:hover:bg-white/2">
                  <td className="p-3 font-mono font-semibold text-[#8654DE] dark:text-[#C5A3FF]">
                    {col.name}
                  </td>
                  <td className="p-3 text-[#6F6A78] dark:text-[#A7A1B3]">{col.type}</td>
                  <td className="p-3">
                    {col.required ? (
                      <Badge variant="error" size="sm">
                        Required
                      </Badge>
                    ) : (
                      <Badge variant="neutral" size="sm">
                        Optional
                      </Badge>
                    )}
                  </td>
                  <td className="p-3 text-[#2D2D2D] dark:text-[#E2DFE8]">{col.description}</td>
                  <td className="p-3 font-mono text-[#6F6A78] dark:text-[#A7A1B3]">
                    {col.example}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};
