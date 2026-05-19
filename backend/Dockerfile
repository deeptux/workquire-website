FROM python:3.11-slim

# CA bundle for MongoDB Atlas TLS (avoids handshake failures in slim images)
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements-prod.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY server.py .

ENV PYTHONUNBUFFERED=1

CMD exec uvicorn server:app --host 0.0.0.0 --port ${PORT:-8080}
