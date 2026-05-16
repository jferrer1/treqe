#!/bin/sh
# Railway startup script
set -e
echo "=== Treqe API ==="
echo "PORT=${PORT:-8000} DB=${DATABASE_URL:0:25}..."
cd /app && exec uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8000} --log-level info
