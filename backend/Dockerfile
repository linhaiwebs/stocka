# Backend Dockerfile - Multi-stage build for production

# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build || true

RUN mkdir -p /app/dist/config /app/dist/config/migrations
RUN cp -r /app/src/config/*.sql /app/dist/config/ 2>/dev/null || true
RUN cp -r /app/src/config/migrations/*.sql /app/dist/config/migrations/ 2>/dev/null || true

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config*.json ./

RUN mkdir -p /app/data /app/backups /app/templates

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/server.js"]
