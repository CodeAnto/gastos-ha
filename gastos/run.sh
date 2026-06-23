#!/usr/bin/env bash
set -e

export DB_PATH="${DB_PATH:-/data/gastos.db}"
mkdir -p /data

echo "[gastos] Arrancando backend (uvicorn) en 127.0.0.1:8000..."
cd /app
uvicorn app.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!
trap "kill $BACKEND_PID 2>/dev/null || true" EXIT

echo "[gastos] Arrancando frontend (nginx) en :8099..."
exec nginx -g 'daemon off;'
