from services.message_generator import load_marketing_prompt

prompt = load_marketing_prompt()

message = prompt.format(
    customer_name="Aarav",
    favorite_food="Burger",
    last_order_date="2026-09-10",
    customer_segment="Frequent Customer",
)

print(message)
