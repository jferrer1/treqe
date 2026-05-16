FROM python:3.12-slim

WORKDIR /app

# System dependencies — gcc para compilar, libpq para PostgreSQL
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt cryptography

# App code
COPY src/ ./src/

# Railway asigna PORT automáticamente
EXPOSE 8000
CMD uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8000}
