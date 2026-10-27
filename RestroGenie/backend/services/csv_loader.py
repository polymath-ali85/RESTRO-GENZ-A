from pathlib import Path
import pandas as pd


REQUIRED_COLUMNS = [
    "customer_id",
    "first_name",
    "last_name",
    "country",
    "city",
    "phone_test_only",
    "email_test_only",
    "signup_date",
    "last_order_date",
    "total_orders",
    "total_spend",
    "currency",
    "favorite_item",
    "last_order_item",
    "avg_order_value",
    "marketing_opt_in",
    "preferred_channel",
]

DATE_COLUMNS = ["signup_date", "last_order_date"]

NUMERIC_COLUMNS = [
    "total_orders",
    "total_spend",
    "avg_order_value",
]


def load_customers(source) -> pd.DataFrame:
    """
    Load customer data from a CSV file path or file-like object.
    Clean column names and convert dates/numeric columns.
    """
    if isinstance(source, (str, Path)):
        df = pd.read_csv(source)
    else:
        df = pd.read_csv(source)

    # Normalize column names
    df.columns = (
        df.columns.astype(str)
        .str.strip()
        .str.lower()
        .str.replace(" ", "_", regex=False)
    )

    # Stop early if required columns are missing
    missing = sorted(set(REQUIRED_COLUMNS) - set(df.columns))

    if missing:
        raise ValueError(
            "CSV is missing required columns: "
            + ", ".join(missing)
        )

    # Trim text values without converting missing values to "nan"
    for column in df.select_dtypes(include=["object"]).columns:
        df[column] = df[column].map(
            lambda value: value.strip()
            if isinstance(value, str)
            else value
        )

    # Parse dates; invalid dates become NaT for validation
    for column in DATE_COLUMNS:
        df[column] = pd.to_datetime(
            df[column], errors="coerce"
        )

    # Convert numbers; invalid values become NaN for validation
    for column in NUMERIC_COLUMNS:
        df[column] = pd.to_numeric(
            df[column], errors="coerce"
        )

    # Standardize consent and channel values
    df["marketing_opt_in"] = (
        df["marketing_opt_in"]
        .astype("string")
        .str.strip()
        .str.lower()
    )

    df["preferred_channel"] = (
        df["preferred_channel"]
        .astype("string")
        .str.strip()
        .str.title()
    )

    return df


def load_customers_from_upload(uploaded_file) -> pd.DataFrame:
    """Convenience wrapper for a Streamlit uploaded CSV."""
    if uploaded_file is None:
        raise ValueError("Please upload a CSV file first.")

    return load_customers(uploaded_file)
