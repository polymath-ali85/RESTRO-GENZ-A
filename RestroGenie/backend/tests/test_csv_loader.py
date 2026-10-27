from services.csv_loader import load_customers
from services.validation import validate_customers, get_marketing_eligible
from services.segmentation import add_customer_segments, segment_customers

csv_path = "data/restrogenie_synthetic_international_customers_150.csv"

# 1. Load CSV
df = load_customers(csv_path)
print("Loaded rows:", len(df))
#po

# 2. Validate data and consent
clean_df, report = validate_customers(df)
print("\nValidation report:")
print(report)

# 3. Find opted-in customers who passed validation
eligible = get_marketing_eligible(clean_df)
print("\nEligible customers:", len(eligible))

# 4. Create customer segments
segmented = add_customer_segments(clean_df)
print("\nSegment counts:")
for column in [
    "segment_frequent",
    "segment_high_spender",
    "segment_inactive",
    "segment_new",
]:
    print(column, int(segmented[column].sum()))

# 5. Preview frequent customers
frequent = segment_customers(clean_df, "Frequent")
print("\nFrequent customer preview:")
print(
    frequent[
        ["customer_id", "first_name", "total_orders", "segments"]
    ].head(10)
)
