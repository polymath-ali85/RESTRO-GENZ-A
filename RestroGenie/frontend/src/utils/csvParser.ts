import { CustomerRecord } from '../types';

export const REQUIRED_COLUMNS = [
  'customer_id',
  'first_name',
  'last_name',
  'country',
  'city',
  'phone_test_only',
  'email_test_only',
  'signup_date',
  'last_order_date',
  'total_orders',
  'total_spend',
  'currency',
  'favorite_item',
  'last_order_item',
  'avg_order_value',
  'marketing_opt_in',
  'preferred_channel',
] as const;

export function parseCsvRows(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentField = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(currentField.trim());
      if (row.some((cell) => cell.length > 0)) {
        lines.push(row);
      }
      row = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || row.length > 0) {
    row.push(currentField.trim());
    if (row.some((cell) => cell.length > 0)) {
      lines.push(row);
    }
  }

  return lines;
}

export function parseCustomerCsv(csvText: string): {
  records: CustomerRecord[];
  missingColumns: string[];
} {
  const rows = parseCsvRows(csvText);
  if (rows.length === 0) {
    return { records: [], missingColumns: [...REQUIRED_COLUMNS] };
  }

  const rawHeaders = rows[0];
  const headers = rawHeaders.map((h) =>
    h.toLowerCase().trim().replace(/\s+/g, '_')
  );

  const missingColumns = REQUIRED_COLUMNS.filter((col) => !headers.includes(col));
  if (missingColumns.length > 0) {
    return { records: [], missingColumns };
  }

  const records: CustomerRecord[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length === 0 || row.every((c) => c === '')) continue;

    const rowObj: Record<string, string> = {};
    headers.forEach((header, index) => {
      rowObj[header] = row[index] !== undefined ? row[index] : '';
    });

    const totalOrders = parseFloat(rowObj['total_orders'] || '0');
    const totalSpend = parseFloat(rowObj['total_spend'] || '0');
    const avgOrderValue = parseFloat(rowObj['avg_order_value'] || '0');

    records.push({
      customer_id: rowObj['customer_id'] || '',
      first_name: rowObj['first_name'] || '',
      last_name: rowObj['last_name'] || '',
      country: rowObj['country'] || '',
      city: rowObj['city'] || '',
      phone_test_only: rowObj['phone_test_only'] || '',
      email_test_only: rowObj['email_test_only'] || '',
      signup_date: rowObj['signup_date'] || '',
      last_order_date: rowObj['last_order_date'] || '',
      total_orders: isNaN(totalOrders) ? 0 : totalOrders,
      total_spend: isNaN(totalSpend) ? 0 : totalSpend,
      currency: (rowObj['currency'] || '').toUpperCase(),
      favorite_item: rowObj['favorite_item'] || '',
      last_order_item: rowObj['last_order_item'] || '',
      avg_order_value: isNaN(avgOrderValue) ? 0 : avgOrderValue,
      marketing_opt_in: (rowObj['marketing_opt_in'] || '').toLowerCase().trim(),
      preferred_channel: capitalizeChannel(rowObj['preferred_channel'] || 'WhatsApp'),
    });
  }

  return { records, missingColumns: [] };
}

function capitalizeChannel(channel: string): string {
  const lower = channel.trim().toLowerCase();
  if (lower === 'whatsapp') return 'WhatsApp';
  if (lower === 'email') return 'Email';
  if (lower === 'sms') return 'Sms';
  return channel.trim() || 'WhatsApp';
}
