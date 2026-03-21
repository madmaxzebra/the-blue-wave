# Build frontend
FROM node:20-bookworm-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Build backend
FROM node:20-bookworm-slim AS backend-builder
WORKDIR /app/backend
COPY backend/ ./
RUN npm ci && npm run build

# Production: frontend + API (same as tunnel setup)
FROM node:20-bookworm-slim
WORKDIR /app

# Install backend production deps only
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

# Copy built backend + assets (email banner)
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/assets ./backend/assets

# Copy built frontend (static files)
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Share-server: serves frontend + proxies /api to backend (like tunnel)
COPY share-server.js ./

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

# Run backend in background, then share-server (frontend + API)
CMD ["sh", "-c", "node backend/dist/server.js & sleep 2 && node share-server.js"]
