from io import BytesIO
import json

import pandas as pd
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os

from services.csv_loader import load_customers
from services.validation import validate_customers
from services.segmentation import add_customer_segments
from services.message_gen_local import generate_marketing_message


app = FastAPI(title="RestroGenie API")

# Local development origins plus comma-separated production origins.
# Example: FRONTEND_ORIGINS=https://your-app.netlify.app
_default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
_extra_origins = [
    origin.strip().rstrip("/")
    for origin in os.getenv("FRONTEND_ORIGINS", "").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(dict.fromkeys(_default_origins + _extra_origins)),
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "RestroGenie API is running!"}


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "message": "Backend connected successfully",
    }


@app.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid CSV file.",
        )

    try:
        contents = await file.read()

        if not contents:
            raise HTTPException(
                status_code=400,
                detail="The uploaded CSV file is empty.",
            )

        df = load_customers(BytesIO(contents))
        clean_df, report = validate_customers(df)
        segmented_df = add_customer_segments(clean_df)

        results = []

        eligible_df = segmented_df[
            segmented_df["marketing_eligible"]
        ]

        for _, customer in eligible_df.iterrows():
            segments = customer.get("segments", ["Regular"])

            if isinstance(segments, list):
                customer_segment = ", ".join(segments)
            else:
                customer_segment = str(segments)

            last_order = customer.get("last_order_date")

            if pd.isna(last_order):
                last_order = None
            else:
                last_order = last_order.strftime("%Y-%m-%d")

            try:
                message = generate_marketing_message(
                    customer_name=customer.get("first_name"),
                    favorite_food=customer.get("favorite_item"),
                    last_order_date=last_order,
                    customer_segment=customer_segment,
                )

                results.append({
                    "customer_id": str(customer["customer_id"]),
                    "customer_name": str(customer["first_name"]),
                    "segment": customer_segment,
                    "segments": (
                        segments if isinstance(segments, list)
                        else [customer_segment]
                    ),
                    "message": message,
                    "status": "success",
                })

            except Exception:
                results.append({
                    "customer_id": str(customer["customer_id"]),
                    "customer_name": str(customer["first_name"]),
                    "segment": customer_segment,
                    "segments": (
                        segments if isinstance(segments, list)
                        else [customer_segment]
                    ),
                    "message": None,
                    "status": "failed",
                    "error": "Message generation failed. Check the backend terminal.",
                })

        successful_results = [
            item for item in results
            if item["status"] == "success"
        ]

        # Count segments among eligible customers.
        segment_counts = {}

        for customer in eligible_df.to_dict(orient="records"):
            customer_segments = customer.get("segments", ["Regular"])

            if not isinstance(customer_segments, list):
                customer_segments = [str(customer_segments)]

            for segment in customer_segments:
                segment = str(segment).strip()
                if segment:
                    segment_counts[segment] = (
                        segment_counts.get(segment, 0) + 1
                    )

        # React dashboard expects one sample draft.
        sample_draft = None

        if successful_results:
            first = successful_results[0]
            sample_draft = {
                "customer_id": first["customer_id"],
                "customer_name": first["customer_name"],
                "segments": first["segments"],
                "message": first["message"],
            }

        return {
            "message": "CSV processed successfully.",
            "filename": file.filename,
            "total_rows": report["total_rows"],
            "eligible_customers": report["eligible_customers"],
            "not_eligible_customers": report["not_eligible_customers"],
            "rows_with_data_errors": report["rows_with_data_errors"],
            "checks": report["checks"],
            "segment_counts": segment_counts,
            "sample_draft": sample_draft,
            "generated_count": len(successful_results),
            "failed_count": len(results) - len(successful_results),
            "results": results,
            # Normalized customer rows power the frontend customer and segment tables.
            "customers": json.loads(
                segmented_df.where(pd.notna(segmented_df), None).to_json(
                    orient="records", date_format="iso"
                )
            ),
            "isLocalFallback": False,
        }

    except HTTPException:
        raise

    except (
        ValueError,
        pd.errors.ParserError,
        UnicodeDecodeError,
    ) as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        print(f"CSV processing error: {exc}")

        raise HTTPException(
            status_code=500,
            detail="CSV processing failed. Check the backend terminal.",
        ) from exc
