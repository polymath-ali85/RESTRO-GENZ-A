import { CustomerRecord, ValidationReport, ValidationChecks } from '../types';

export const VALID_CONSENT_VALUES = new Set(['yes', 'no']);
export const VALID_CHANNELS = new Set(['WhatsApp', 'Email', 'Sms']);

export function validateCustomers(records: CustomerRecord[]): {
  cleanRecords: CustomerRecord[];
  report: ValidationReport;
} {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // Check ID duplicates
  const idCounts = new Map<string, number>();
  records.forEach((rec) => {
    const id = rec.customer_id.trim();
    if (id) {
      idCounts.set(id, (idCounts.get(id) || 0) + 1);
    }
  });

  const checks: ValidationChecks = {
    missing_required_rows: 0,
    duplicate_id_rows: 0,
    invalid_consent_rows: 0,
    invalid_total_orders_rows: 0,
    invalid_total_spend_rows: 0,
    invalid_avg_order_value_rows: 0,
    invalid_signup_date_rows: 0,
    invalid_last_order_date_rows: 0,
    last_order_before_signup_rows: 0,
  };

  let rowsWithDataErrors = 0;
  let eligibleCount = 0;

  const cleanRecords: CustomerRecord[] = records.map((rec) => {
    const issues: string[] = [];

    // 1. Missing required values
    const missingRequired =
      !rec.customer_id.trim() ||
      !rec.first_name.trim() ||
      !rec.phone_test_only.trim() ||
      !rec.marketing_opt_in.trim();

    if (missingRequired) {
      checks.missing_required_rows++;
      issues.push('Missing required identity field');
    }

    // 2. Duplicate ID
    const isDuplicateId =
      Boolean(rec.customer_id.trim()) && (idCounts.get(rec.customer_id.trim()) || 0) > 1;

    if (isDuplicateId) {
      checks.duplicate_id_rows++;
      issues.push('Duplicate customer_id');
    }

    // 3. Invalid consent
    const isInvalidConsent = !VALID_CONSENT_VALUES.has(rec.marketing_opt_in.toLowerCase());
    if (isInvalidConsent) {
      checks.invalid_consent_rows++;
      issues.push('Invalid consent value (expected "yes" or "no")');
    }

    // 4. Invalid total orders
    const isInvalidOrders =
      rec.total_orders < 0 || !Number.isInteger(rec.total_orders);
    if (isInvalidOrders) {
      checks.invalid_total_orders_rows++;
      issues.push('Invalid total_orders value');
    }

    // 5. Invalid total spend
    const isInvalidSpend = rec.total_spend < 0;
    if (isInvalidSpend) {
      checks.invalid_total_spend_rows++;
      issues.push('Invalid total_spend value (negative)');
    }

    // 6. Invalid average order value
    const isInvalidAvg = rec.avg_order_value < 0;
    if (isInvalidAvg) {
      checks.invalid_avg_order_value_rows++;
      issues.push('Invalid avg_order_value (negative)');
    }

    // 7. Dates
    let invalidSignupDate = false;
    let invalidLastOrderDate = false;
    let invalidDateOrder = false;

    let signupDateObj: Date | null = null;
    let lastOrderDateObj: Date | null = null;

    if (rec.signup_date) {
      signupDateObj = new Date(rec.signup_date);
      if (isNaN(signupDateObj.getTime()) || signupDateObj > today) {
        invalidSignupDate = true;
      }
    } else {
      invalidSignupDate = true;
    }

    if (rec.last_order_date) {
      lastOrderDateObj = new Date(rec.last_order_date);
      if (isNaN(lastOrderDateObj.getTime()) || lastOrderDateObj > today) {
        invalidLastOrderDate = true;
      }
    } else {
      invalidLastOrderDate = true;
    }

    if (invalidSignupDate) {
      checks.invalid_signup_date_rows++;
      issues.push('Invalid or future signup_date');
    }

    if (invalidLastOrderDate) {
      checks.invalid_last_order_date_rows++;
      issues.push('Invalid or future last_order_date');
    }

    if (
      signupDateObj &&
      lastOrderDateObj &&
      !isNaN(signupDateObj.getTime()) &&
      !isNaN(lastOrderDateObj.getTime())
    ) {
      if (lastOrderDateObj < signupDateObj) {
        invalidDateOrder = true;
        checks.last_order_before_signup_rows++;
        issues.push('last_order_date is before signup_date');
      }
    }

    const hasDataError =
      missingRequired ||
      isDuplicateId ||
      isInvalidConsent ||
      isInvalidOrders ||
      isInvalidSpend ||
      isInvalidAvg ||
      invalidSignupDate ||
      invalidLastOrderDate ||
      invalidDateOrder;

    if (hasDataError) {
      rowsWithDataErrors++;
    }

    // Explicit opt-in only
    const marketingEligible =
      rec.marketing_opt_in.toLowerCase() === 'yes' &&
      !hasDataError &&
      rec.phone_test_only.trim().length > 0;

    if (marketingEligible) {
      eligibleCount++;
    }

    return {
      ...rec,
      has_data_error: hasDataError,
      marketing_eligible: marketingEligible,
      validation_issues: issues,
    };
  });

  const report: ValidationReport = {
    total_rows: cleanRecords.length,
    eligible_customers: eligibleCount,
    not_eligible_customers: cleanRecords.length - eligibleCount,
    rows_with_data_errors: rowsWithDataErrors,
    checks,
  };

  return { cleanRecords, report };
}
