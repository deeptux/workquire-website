# Cloud Build / Cloud Run (repo root) — builds the FastAPI app in backend/
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements-prod.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/server.py .

ENV PYTHONUNBUFFERED=1

CMD exec uvicorn server:app --host 0.0.0.0 --port ${PORT:-8080}
