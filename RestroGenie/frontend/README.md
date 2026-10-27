# RestroGenie — AI-Powered Restaurant Marketing Dashboard

RestroGenie is a SaaS platform designed for restaurants to ingest customer order data, run compliance & consent auditing, segment customers into targeted behavioral cohorts, and generate witty, personalized Hinglish marketing message drafts tailored for WhatsApp/SMS marketing.

Built around the Python backend found in `RestroGenie-main.zip`.

---

## 1. Discovered Backend Architecture (from `RestroGenie-main.zip`)

- **Framework**: **FastAPI** (`RestroGenie-main/restaurant-ai-marketing/api.py`), served via `uvicorn api:app --reload --port 8000`.
- **Prototype Script**: Streamlit MVP (`app.py`), previously used for exploratory testing.
- **AI Engine**: LangChain `ChatOpenAI` configured with OpenRouter (`google/gemma-4-31b-it`) and Hinglish copywriting prompt template (`prompts/marketing.txt`).

### Discovered Backend Endpoints:
1. `GET /` — Returns status message: `{"message": "RestroGenie API is running!"}`
2. `GET /api/health` — Connectivity test: `{"status": "ok", "message": "Backend connected successfully"}`
3. `POST /upload-csv` — Multipart form upload (`file: UploadFile`). Orchestrates:
   - `services.csv_loader.load_customers(file)`
   - `services.validation.validate_customers(df)`
   - `services.segmentation.add_customer_segments(clean_df)`
   - `services.message_gen_local.generate_marketing_message(...)`

### Discovered CSV Schema Contract (Strict 17 Columns):
`customer_id`, `first_name`, `last_name`, `country`, `city`, `phone_test_only`, `email_test_only`, `signup_date`, `last_order_date`, `total_orders`, `total_spend`, `currency`, `favorite_item`, `last_order_item`, `avg_order_value`, `marketing_opt_in`, `preferred_channel`

### Discovered Segmentation Rules:
- **Frequent**: `total_orders >= 5`
- **High Spender**: Top 25% quantile of `total_spend` grouped by currency (requires >= 4 records per currency)
- **Inactive**: `days_since_last_order > 90`
- **New Customer**: `signup_date` within the last 30 days
- **Favorite Item Known**: `favorite_item` is non-empty
- **Regular**: Standard baseline diner matching no special criteria

---

## 2. Connected vs. Unimplemented Feature Matrix

| Feature | Backend Status | Frontend Implementation |
|---|---|---|
| **Health Check & Ping** | Implemented (`/api/health`) | Live ping monitor in Topbar & Settings |
| **CSV Ingestion & Parsing** | Implemented (`/upload-csv`) | Drag & drop + click-to-upload + pre-packaged demo dataset (152 rows) |
| **Data Quality & Validation Checks** | Implemented (`services/validation.py`) | 9-point compliance checklist card + row-level error tags |
| **Customer Segmentation** | Implemented (`services/segmentation.py`) | Segment distribution cards, criteria definitions & cohort customer tables |
| **Hinglish AI Message Studio** | Implemented (`prompts/marketing.txt`) | Live Hinglish copy generator, batch draft review, inline editor, approve/reject |
| **Direct External SMS/WhatsApp Dispatch** | **Not Implemented** (`services/sender.py` is 0 bytes) | Simulation Mode: recipient audit log and CSV draft export; clearly marked as dry-run |
| **Database Persistence for Campaigns** | **Not Implemented** (`services/db.py` is 0 bytes) | Stored securely in browser `localStorage` |
| **Analytics Endpoint** | **Not Implemented** (`services/analytics.py` is 0 bytes) | Calculated client-side from real validated records |

---

## 3. Brand Identity & Color System

- **Primary Colors**:
  - **Lavender Mist**: `#C5A3FF` (Accents, highlights, active nav, primary buttons in dark mode)
  - **Charcoal**: `#2D2D2D` (Primary typography, dark surfaces, high-contrast buttons)
- **Supporting Palette**:
  - Soft Lavender Background: `#F5F0FF`
  - Main Page Background: `#FAF9FC` (Dark: `#141317`)
  - Border Subtle: `#E9E4F0` (Dark: `#312E3C`)
  - Success Green: `#27845A`
  - Warning Amber: `#D69A32`
  - Error Coral: `#D94F5C`
- **Dark Mode**: Persisted in `localStorage`, full support across cards, tables, charts, and navigation.

---

## 4. How to Run Locally

### Step 1: Start the Python FastAPI Backend (Terminal 1)
```bash
cd RestroGenie-main/restaurant-ai-marketing
pip install -r requirements.txt
uvicorn api:app --reload --port 8000
```
Verify at: `http://127.0.0.1:8000/api/health`

### Step 2: Start the React Frontend (Terminal 2)
```bash
npm install
npm run dev
```
Open your browser at `http://localhost:3000`.

*Note: If the Python backend is not started, the frontend automatically activates the **Local Evaluation Engine**, running identical validation and segmentation rules directly in the browser so you can test all views immediately.*

---

## 5. Verification & Testing Summary

- Built-in TypeScript unit tests ran via `npx --yes tsx --test src/utils/*.test.ts` (9/9 passed).
- Playwright headless Chromium visual verification passed on desktop and mobile viewports.
- No secrets or API keys hardcoded in frontend files.
