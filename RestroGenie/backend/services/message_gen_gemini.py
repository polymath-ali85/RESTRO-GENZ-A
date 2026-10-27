# from pathlib import Path
# from langchain_core.prompts import PromptTemplate
# import os
# from dotenv import load_dotenv
# from langchain_google_genai import ChatGoogleGenerativeAI


# load_dotenv()


# PROJECT_ROOT = Path(__file__).resolve().parent.parent
# PROMPT_PATH = PROJECT_ROOT / "prompts" / "marketing.txt"


# def load_marketing_prompt():
#     template = PROMPT_PATH.read_text(encoding="utf-8")

#     prompt = PromptTemplate(
#         input_variables=[
#             "customer_name",
#             "favorite_food",
#             "last_order_date",
#             "customer_segment",
#         ],
#         template=template,
#     )

#     return prompt



# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# if not GEMINI_API_KEY:
#     raise RuntimeError("GEMINI_API_KEY .env mein set nahi hai")


# llm = ChatGoogleGenerativeAI(
#     model="gemini-3.8-flash",
#     api_key=GEMINI_API_KEY
# )


# prompt = load_marketing_prompt()

# messages = prompt.format(
#     customer_name="Aarav",
#     favorite_food="Burger",
#     last_order_date="2026-09-10",
#     customer_segment="Frequent Customer",
# )

# response = llm.invoke(messages)

# content = response.content

# if isinstance(content, list):
#     for item in content:
#         if isinstance(item, dict) and item.get("type") == "text":
#             print(item["text"])
# else:
#     print(content)