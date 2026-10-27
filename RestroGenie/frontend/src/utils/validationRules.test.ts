import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCustomers } from './validationRules';
import { CustomerRecord } from '../types';

const createBaseRecord = (overrides?: Partial<CustomerRecord>): CustomerRecord => ({
  customer_id: 'RG001',
  first_name: 'Milan',
  last_name: 'Moore',
  country: 'United States',
  city: 'New York',
  phone_test_only: '+1-555-0100',
  email_test_only: 'milan@example.com',
  signup_date: '2024-05-01',
  last_order_date: '2025-05-01',
  total_orders: 5,
  total_spend: 150,
  currency: 'USD',
  favorite_item: 'Brownie',
  last_order_item: 'Brownie',
  avg_order_value: 30,
  marketing_opt_in: 'yes',
  preferred_channel: 'WhatsApp',
  ...overrides,
});

test('validateCustomers accepts clean customer as eligible', () => {
  const records = [createBaseRecord()];
  const { cleanRecords, report } = validateCustomers(records);

  assert.equal(report.total_rows, 1);
  assert.equal(report.eligible_customers, 1);
  assert.equal(report.rows_with_data_errors, 0);
  assert.equal(cleanRecords[0].marketing_eligible, true);
});

test('validateCustomers rejects customers with marketing_opt_in = "no"', () => {
  const records = [createBaseRecord({ marketing_opt_in: 'no' })];
  const { cleanRecords, report } = validateCustomers(records);

  assert.equal(report.total_rows, 1);
  assert.equal(report.eligible_customers, 0);
  assert.equal(cleanRecords[0].marketing_eligible, false);
});

test('validateCustomers catches duplicate customer IDs and future dates', () => {
  const records = [
    createBaseRecord({ customer_id: 'DUP1' }),
    createBaseRecord({ customer_id: 'DUP1' }),
    createBaseRecord({ customer_id: 'FUT1', signup_date: '2099-01-01' }),
  ];
  const { report } = validateCustomers(records);

  assert.equal(report.checks.duplicate_id_rows, 2);
  assert.equal(report.checks.invalid_signup_date_rows, 1);
  assert.equal(report.rows_with_data_errors, 3);
});

test('validateCustomers catches last_order_date before signup_date', () => {
  const records = [
    createBaseRecord({
      signup_date: '2025-06-01',
      last_order_date: '2025-01-01',
    }),
  ];
  const { cleanRecords, report } = validateCustomers(records);

  assert.equal(report.checks.last_order_before_signup_rows, 1);
  assert.equal(cleanRecords[0].marketing_eligible, false);
});
