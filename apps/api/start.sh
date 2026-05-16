#!/bin/sh
# Treqe API startup
echo "=== Treqe API ==="
echo "PORT=$PORT"
cd /app && exec uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8000} --log-level info
