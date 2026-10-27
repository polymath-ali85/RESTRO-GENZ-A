import pandas as pd


def add_customer_segments(df: pd.DataFrame) -> pd.DataFrame:
    """
    Add useful marketing segments to each customer.

    Segments:
    - Frequent customer
    - High spender (compared within the same currency)
    - Inactive customer
    - New customer
    """
    result = df.copy()
    today = pd.Timestamp.now().normalize()

    # Parse dates safely
    result["signup_date"] = pd.to_datetime(
        result["signup_date"], errors="coerce"
    )
    result["last_order_date"] = pd.to_datetime(
        result["last_order_date"], errors="coerce"
    )

    result["total_orders"] = pd.to_numeric(
        result["total_orders"], errors="coerce"
    )
    result["total_spend"] = pd.to_numeric(
        result["total_spend"], errors="coerce"
    )

    # Frequent customers: at least 5 recorded orders
    result["segment_frequent"] = (
        result["total_orders"] >= 5
    )

    # Inactive: no order in the last 90 days
    days_since_order = (
        today - result["last_order_date"].dt.normalize()
    ).dt.days

    result["days_since_last_order"] = days_since_order

    result["segment_inactive"] = (
        days_since_order > 90
    ) & result["last_order_date"].notna()

    # New signup: joined in the last 30 days
    signup_age = (
        today - result["signup_date"].dt.normalize()
    ).dt.days

    result["segment_new"] = (
        signup_age.between(0, 30)
    )

    # High spenders: top 25% within each currency.
    # Requires at least 4 customers in a currency group.
    result["segment_high_spender"] = False

    valid_spend = (
        result["total_spend"].notna()
        & result["currency"].notna()
    )

    for currency, indexes in result[valid_spend].groupby(
        "currency"
    ).groups.items():
        currency_spend = result.loc[indexes, "total_spend"]

        if len(currency_spend) >= 4:
            threshold = currency_spend.quantile(0.75)

            result.loc[indexes, "segment_high_spender"] = (
                currency_spend >= threshold
            )

    # Normalize favourite item values
    result["favorite_item"] = (
        result["favorite_item"]
        .astype("string")
        .str.strip()
    )

    result["segment_has_favorite_item"] = (
        result["favorite_item"].notna()
        & result["favorite_item"].ne("")
    )

    # Human-readable segment labels; customers may have multiple labels
    def labels_for_customer(row):
        labels = []

        if row["segment_frequent"]:
            labels.append("Frequent")

        if row["segment_high_spender"]:
            labels.append("High Spender")

        if row["segment_inactive"]:
            labels.append("Inactive")

        if row["segment_new"]:
            labels.append("New Customer")

        if row["segment_has_favorite_item"]:
            labels.append("Favorite Item Known")

        if not labels:
            labels.append("Regular")

        return labels

    result["segments"] = result.apply(
        labels_for_customer, axis=1
    )

    return result


def segment_customers(
    df: pd.DataFrame,
    segment: str = "All",
) -> pd.DataFrame:
    """
    Filter customers by a named segment.

    Available:
    All, Frequent, High Spender, Inactive,
    New Customer, Favorite Item Known, Regular
    """
    result = add_customer_segments(df)

    if segment == "All":
        return result

    segment_columns = {
        "Frequent": "segment_frequent",
        "High Spender": "segment_high_spender",
        "Inactive": "segment_inactive",
        "New Customer": "segment_new",
        "Favorite Item Known": "segment_has_favorite_item",
    }

    if segment == "Regular":
        known_segments = list(segment_columns.values())
        return result[~result[known_segments].any(axis=1)]

    if segment not in segment_columns:
        raise ValueError(
            f"Unknown segment: {segment}. "
            f"Choose from All, {', '.join(segment_columns)}, Regular."
        )

    return result[result[segment_columns[segment]]].copy()


def segment_by_favorite_item(
    df: pd.DataFrame,
    item: str,
) -> pd.DataFrame:
    """Return customers whose recorded favourite item matches."""
    result = add_customer_segments(df)

    return result[
        result["favorite_item"].str.casefold()
        == item.strip().casefold()
    ].copy()
