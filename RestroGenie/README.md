# RestroGenie — MVP

RestroGenie is a restaurant customer-data and marketing-draft MVP. It validates customer CSV data, assigns segments, and generates marketing message drafts through a FastAPI backend. The frontend includes a local evaluation fallback for preview/testing when the backend is unreachable; that fallback is not a live AI service.

## Structure

- `frontend/` — React + TypeScript + Vite app for Netlify
- `backend/` — FastAPI API to deploy separately

## Run locally

### Backend (terminal 1)

Use Python 3.10+ (Python 3.11 recommended).

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
# Edit backend/.env and set OPENROUTER_API_KEY for live AI generation.
uvicorn api:app --reload --port 8000
```

Health check: `http://127.0.0.1:8000/api/health`

### Frontend (terminal 2)

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open the URL shown by Vite (normally `http://localhost:3000`). `VITE_API_BASE_URL` should point to the backend origin, such as `http://127.0.0.1:8000`.

## Deploy

### Backend

Deploy the `backend/` directory to a Python host supporting FastAPI. Install `requirements.txt` and start with:

```bash
uvicorn api:app --host 0.0.0.0 --port $PORT
```

Configure host environment variables:
- `OPENROUTER_API_KEY` — required for live AI message generation.
- `FRONTEND_ORIGINS` — exact Netlify origin, e.g. `https://your-site.netlify.app`.

### Netlify

The included `netlify.toml` builds the `frontend/` directory. Set Netlify's `VITE_API_BASE_URL` to the deployed backend URL (without a trailing slash), then redeploy.

## MVP limitations

- WhatsApp/SMS delivery is not implemented. Campaign actions are drafts/simulations only.
- There is no server database or multi-user persistence in this MVP.
- Live AI generation requires a valid OpenRouter API key. The API reports per-customer generation failures.
- Test with sample data before using real customer data.

## Security

Never commit `.env`, API credentials, customer exports, or real personal data. Only commit `.env.example` with placeholder values. Variables prefixed `VITE_` are public in the browser bundle and must not contain secrets.
