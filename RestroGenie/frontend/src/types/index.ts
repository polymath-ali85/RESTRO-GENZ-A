export interface CustomerRecord {
  customer_id: string;
  first_name: string;
  last_name: string;
  country: string;
  city: string;
  phone_test_only: string;
  email_test_only: string;
  signup_date: string; // YYYY-MM-DD
  last_order_date: string; // YYYY-MM-DD
  total_orders: number;
  total_spend: number;
  currency: string;
  favorite_item: string;
  last_order_item: string;
  avg_order_value: number;
  marketing_opt_in: string; // 'yes' | 'no'
  preferred_channel: string; // 'WhatsApp' | 'Email' | 'Sms'
  // Computed fields
  segments?: string[];
  marketing_eligible?: boolean;
  has_data_error?: boolean;
  validation_issues?: string[];
}

export interface ValidationChecks {
  missing_required_rows: number;
  duplicate_id_rows: number;
  invalid_consent_rows: number;
  invalid_total_orders_rows: number;
  invalid_total_spend_rows: number;
  invalid_avg_order_value_rows: number;
  invalid_signup_date_rows: number;
  invalid_last_order_date_rows: number;
  last_order_before_signup_rows: number;
}

export interface ValidationReport {
  total_rows: number;
  eligible_customers: number;
  not_eligible_customers: number;
  rows_with_data_errors: number;
  checks: ValidationChecks;
}

export interface GeneratedResultItem {
  customer_id: string;
  customer_name: string;
  segment: string;
  segments: string[];
  message: string | null;
  status: 'success' | 'failed';
  error?: string;
  channel?: string;
}

export interface SampleDraft {
  customer_id: string;
  customer_name: string;
  segments: string[];
  message: string;
}

export interface UploadCsvResponse {
  message: string;
  filename: string;
  total_rows: number;
  eligible_customers: number;
  not_eligible_customers: number;
  rows_with_data_errors: number;
  checks: ValidationChecks;
  segment_counts: Record<string, number>;
  sample_draft: SampleDraft | null;
  generated_count: number;
  failed_count: number;
  results: GeneratedResultItem[];
  customers?: CustomerRecord[];
  isLocalFallback?: boolean;
}

export interface BackendHealthResponse {
  status: string;
  message: string;
  url?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface CampaignHistoryItem {
  id: string;
  title: string;
  target_segment: string;
  created_at: string;
  recipient_count: number;
  mode: 'Simulation only' | 'Draft generation';
  status: 'Completed' | 'Pending Approval';
}
