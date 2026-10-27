from pathlib import Path
import os

from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI


load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parent.parent
PROMPT_PATH = PROJECT_ROOT / "prompts" / "marketing.txt"


def load_marketing_prompt():
    if not PROMPT_PATH.exists():
        raise FileNotFoundError(
            f"Marketing prompt not found: {PROMPT_PATH}"
        )

    template = PROMPT_PATH.read_text(encoding="utf-8")

    return PromptTemplate(
        input_variables=[
            "customer_name",
            "favorite_food",
            "last_order_date",
            "customer_segment",
        ],
        template=template,
    )


def generate_marketing_message(
    customer_name=None,
    favorite_food=None,
    last_order_date=None,
    customer_segment="Regular",
):
    api_key = os.getenv("OPENROUTER_API_KEY")

    if not api_key:
        raise RuntimeError(
            "OPENROUTER_API_KEY .env mein set nahi hai"
        )

    def clean(value):
        if value is None:
            return ""

        value = str(value).strip()

        if value.lower() in {"nan", "none", "nat", "<na>"}:
            return ""

        return value

    customer_name = clean(customer_name)
    favorite_food = clean(favorite_food)
    last_order_date = clean(last_order_date)
    customer_segment = clean(customer_segment) or "Regular"

    prompt = load_marketing_prompt()

    llm = ChatOpenAI(
        model="google/gemma-4-31b-it",
        api_key=api_key,
        base_url="https://openrouter.ai/api/v1",
        temperature=0.8,
    )

    message = prompt.format(
        customer_name=customer_name,
        favorite_food=favorite_food,
        last_order_date=last_order_date,
        customer_segment=customer_segment,
    )

    response = llm.invoke(message)
    content = response.content

    if isinstance(content, list):
        content = "\n".join(
            item["text"]
            for item in content
            if isinstance(item, dict)
            and item.get("type") == "text"
        )

    content = str(content).strip()

    if not content:
        raise RuntimeError("AI ne empty message return kiya.")

    return content