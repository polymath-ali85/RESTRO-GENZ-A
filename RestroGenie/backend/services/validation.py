import pandas as pd

from services.csv_loader import REQUIRED_COLUMNS


VALID_CONSENT_VALUES = {"yes", "no"}
VALID_CHANNELS = {"WhatsApp", "Email", "Sms"}


def validate_customers(df: pd.DataFrame):
    """
    Returns:
        clean_df: DataFrame with validation status columns
        report: Summary dictionary of data-quality issues
    """
    clean_df = df.copy()
    issues = []

    missing_columns = sorted(
        set(REQUIRED_COLUMNS) - set(clean_df.columns)
    )

    if missing_columns:
        raise ValueError(
            "Missing required columns: "
            + ", ".join(missing_columns)
        )

    # Required identity fields
    required_values = [
        "customer_id",
        "first_name",
        "phone_test_only",
        "marketing_opt_in",
    ]

    for column in required_values:
        clean_df[column] = clean_df[column].replace(
            r"^\s*$", pd.NA, regex=True
        )

    # Identify missing required values
    missing_required = clean_df[required_values].isna().any(axis=1)

    # Duplicate customer IDs
    duplicate_ids = (
        clean_df["customer_id"].notna()
        & clean_df["customer_id"].duplicated(keep=False)
    )

    # Invalid consent values must not be treated as consent
    invalid_consent = ~clean_df["marketing_opt_in"].isin(
        VALID_CONSENT_VALUES
    )

    # Check numeric values
    invalid_orders = (
        clean_df["total_orders"].isna()
        | (clean_df["total_orders"] < 0)
        | (clean_df["total_orders"] % 1 != 0)
    )

    invalid_spend = (
        clean_df["total_spend"].isna()
        | (clean_df["total_spend"] < 0)
    )

    invalid_average = (
        clean_df["avg_order_value"].isna()
        | (clean_df["avg_order_value"] < 0)
    )

    # Dates must be parseable and not in the future
    today = pd.Timestamp.now().normalize()

    invalid_signup_date = (
        clean_df["signup_date"].isna()
        | (clean_df["signup_date"] > today)
    )

    invalid_order_date = (
        clean_df["last_order_date"].isna()
        | (clean_df["last_order_date"] > today)
    )

    invalid_date_order = (
        clean_df["signup_date"].notna()
        & clean_df["last_order_date"].notna()
        & (clean_df["last_order_date"] < clean_df["signup_date"])
    )

    clean_df["has_missing_required"] = missing_required
    clean_df["has_duplicate_id"] = duplicate_ids
    clean_df["has_invalid_consent"] = invalid_consent

    clean_df["has_data_error"] = (
        missing_required
        | duplicate_ids
        | invalid_consent
        | invalid_orders
        | invalid_spend
        | invalid_average
        | invalid_signup_date
        | invalid_order_date
        | invalid_date_order
    )

    # Conservative rule: only explicit "yes" counts as opt-in
    clean_df["marketing_eligible"] = (
        clean_df["marketing_opt_in"].eq("yes")
        & ~clean_df["has_data_error"]
        & clean_df["phone_test_only"].notna()
        & clean_df["phone_test_only"].astype(str).str.strip().ne("")
    )

    checks = {
        "missing_required_rows": int(missing_required.sum()),
        "duplicate_id_rows": int(duplicate_ids.sum()),
        "invalid_consent_rows": int(invalid_consent.sum()),
        "invalid_total_orders_rows": int(invalid_orders.sum()),
        "invalid_total_spend_rows": int(invalid_spend.sum()),
        "invalid_avg_order_value_rows": int(invalid_average.sum()),
        "invalid_signup_date_rows": int(invalid_signup_date.sum()),
        "invalid_last_order_date_rows": int(invalid_order_date.sum()),
        "last_order_before_signup_rows": int(invalid_date_order.sum()),
    }

    report = {
        "total_rows": len(clean_df),
        "eligible_customers": int(
            clean_df["marketing_eligible"].sum()
        ),
        "not_eligible_customers": int(
            (~clean_df["marketing_eligible"]).sum()
        ),
        "rows_with_data_errors": int(
            clean_df["has_data_error"].sum()
        ),
        "checks": checks,
    }

    return clean_df, report


def get_marketing_eligible(
    df: pd.DataFrame,
    channel: str | None = None,
) -> pd.DataFrame:
    """
    Return customers with explicit opt-in and no validation errors.
    If a channel is specified, require a matching preferred channel.
    """
    if "marketing_eligible" not in df.columns:
        df, _ = validate_customers(df)

    eligible = df[df["marketing_eligible"]].copy()

    if channel:
        eligible = eligible[
            eligible["preferred_channel"].str.casefold()
            == channel.casefold()
        ]

    return eligible
