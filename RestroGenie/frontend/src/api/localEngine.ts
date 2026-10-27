import { UploadCsvResponse, GeneratedResultItem, SampleDraft } from '../types';
import { parseCustomerCsv } from '../utils/csvParser';
import { validateCustomers } from '../utils/validationRules';
import { addCustomerSegments } from '../utils/segmentationRules';
import { generateHinglishMarketingDraft } from '../utils/promptTemplates';

export async function processCsvWithLocalEngine(
  fileContent: string,
  filename: string
): Promise<UploadCsvResponse> {
  const { records, missingColumns } = parseCustomerCsv(fileContent);

  if (missingColumns.length > 0) {
    throw new Error(
      `CSV is missing required columns: ${missingColumns.join(', ')}`
    );
  }

  if (records.length === 0) {
    throw new Error('The uploaded CSV file is empty or contains no customer rows.');
  }

  // 1. Validate customers (services/validation.py logic)
  const { cleanRecords, report } = validateCustomers(records);

  // 2. Segment customers (services/segmentation.py logic)
  const { records: segmentedRecords, segmentCounts } = addCustomerSegments(cleanRecords);

  // 3. Generate marketing drafts for eligible customers (prompts/marketing.txt logic)
  const eligibleRecords = segmentedRecords.filter((c) => c.marketing_eligible);

  const results: GeneratedResultItem[] = eligibleRecords.map((customer) => {
    const segments = customer.segments && customer.segments.length > 0
      ? customer.segments
      : ['Regular'];
    const segmentStr = segments.join(', ');

    const message = generateHinglishMarketingDraft({
      customerName: customer.first_name,
      favoriteFood: customer.favorite_item,
      lastOrderDate: customer.last_order_date,
      customerSegment: segmentStr,
      channel: (customer.preferred_channel as 'WhatsApp' | 'Email' | 'Sms') || 'WhatsApp',
    });

    return {
      customer_id: customer.customer_id,
      customer_name: customer.first_name,
      segment: segmentStr,
      segments,
      message,
      status: 'success',
      channel: customer.preferred_channel,
    };
  });

  let sampleDraft: SampleDraft | null = null;
  if (results.length > 0) {
    sampleDraft = {
      customer_id: results[0].customer_id,
      customer_name: results[0].customer_name,
      segments: results[0].segments,
      message: results[0].message || '',
    };
  }

  return {
    message: 'CSV processed successfully (Local Evaluation Engine).',
    filename,
    total_rows: report.total_rows,
    eligible_customers: report.eligible_customers,
    not_eligible_customers: report.not_eligible_customers,
    rows_with_data_errors: report.rows_with_data_errors,
    checks: report.checks,
    segment_counts: segmentCounts,
    sample_draft: sampleDraft,
    generated_count: results.length,
    failed_count: 0,
    results,
    customers: segmentedRecords,
    isLocalFallback: true,
  };
}

export async function loadSampleCustomerData(): Promise<UploadCsvResponse> {
  const response = await fetch('/restrogenie_cust_sample.csv');
  if (!response.ok) {
    throw new Error('Failed to load sample dataset from /restrogenie_cust_sample.csv');
  }
  const text = await response.text();
  return processCsvWithLocalEngine(text, 'restrogenie_cust.csv (Sample Dataset)');
}
