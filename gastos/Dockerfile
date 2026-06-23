# ---------- Stage 1: build del frontend ----------
FROM node:20-alpine AS frontend
WORKDIR /build
# Ruta RELATIVA "api": funciona bajo Ingress (/api/hassio_ingress/<token>/api/...) y puerto directo (/api/...)
ENV VITE_API_URL=api
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ---------- Stage 2: imagen final (backend + nginx) ----------
FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx gcc bash \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/app ./app
COPY --from=frontend /build/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -f /etc/nginx/sites-enabled/default

COPY run.sh /run.sh
RUN chmod +x /run.sh

ENV DB_PATH=/data/gastos.db

EXPOSE 8099
CMD ["/run.sh"]
