import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCustomerCsv, REQUIRED_COLUMNS } from './csvParser';

test('CSV parser identifies missing columns correctly', () => {
  const invalidCsv = 'customer_id,first_name,last_name\n1,Aarav,Sharma';
  const result = parseCustomerCsv(invalidCsv);
  assert.equal(result.records.length, 0);
  assert.ok(result.missingColumns.includes('phone_test_only'));
  assert.ok(result.missingColumns.includes('marketing_opt_in'));
});

test('CSV parser correctly processes valid header and rows', () => {
  const header = REQUIRED_COLUMNS.join(',');
  const row = 'RG001,Milan,Moore,US,New York,+1-202-555-0100,milan@example.com,2024-05-03,2026-07-15,5,100,USD,Brownie,Brownie,20,yes,Email';
  const csv = `${header}\n${row}`;

  const result = parseCustomerCsv(csv);
  assert.equal(result.missingColumns.length, 0);
  assert.equal(result.records.length, 1);
  assert.equal(result.records[0].customer_id, 'RG001');
  assert.equal(result.records[0].first_name, 'Milan');
  assert.equal(result.records[0].total_orders, 5);
  assert.equal(result.records[0].marketing_opt_in, 'yes');
  assert.equal(result.records[0].preferred_channel, 'Email');
});
