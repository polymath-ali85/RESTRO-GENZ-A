import test from 'node:test';
import assert from 'node:assert/strict';
import { addCustomerSegments } from './segmentationRules';
import { CustomerRecord } from '../types';

const createCustomer = (overrides?: Partial<CustomerRecord>): CustomerRecord => ({
  customer_id: 'RG001',
  first_name: 'Milan',
  last_name: 'Moore',
  country: 'US',
  city: 'NY',
  phone_test_only: '12345',
  email_test_only: 'test@example.com',
  signup_date: '2024-01-01',
  last_order_date: '2026-10-15',
  total_orders: 1,
  total_spend: 50,
  currency: 'USD',
  favorite_item: 'Pizza',
  last_order_item: 'Pizza',
  avg_order_value: 50,
  marketing_opt_in: 'yes',
  preferred_channel: 'WhatsApp',
  marketing_eligible: true,
  ...overrides,
});

test('Frequent segment applied when total_orders >= 5', () => {
  const customer = createCustomer({ total_orders: 5 });
  const { records } = addCustomerSegments([customer]);
  assert.ok(records[0].segments?.includes('Frequent'));
});

test('Inactive segment applied when last_order_date > 90 days ago', () => {
  const customer = createCustomer({ last_order_date: '2024-01-01' });
  const { records } = addCustomerSegments([customer]);
  assert.ok(records[0].segments?.includes('Inactive'));
});

test('Regular segment applied when no special criteria match', () => {
  const customer = createCustomer({
    total_orders: 2,
    favorite_item: '',
    signup_date: '2024-01-01',
    last_order_date: new Date().toISOString().slice(0, 10),
  });
  const { records } = addCustomerSegments([customer]);
  assert.ok(records[0].segments?.includes('Regular'));
});
