# Frontend Dockerfile - Multi-stage build for production

# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

ARG VITE_API_BASE_URL
ARG VITE_API_SUBDOMAIN
ARG VITE_API_TIMEOUT
ARG VITE_DOMAIN_MAIN
ARG VITE_DOMAIN_ADMIN
ARG VITE_ENABLE_ANALYTICS
ARG VITE_ENABLE_CONVERSION_TRACKING
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_SUBDOMAIN=${VITE_API_SUBDOMAIN}
ENV VITE_API_TIMEOUT=${VITE_API_TIMEOUT}
ENV VITE_DOMAIN_MAIN=${VITE_DOMAIN_MAIN}
ENV VITE_DOMAIN_ADMIN=${VITE_DOMAIN_ADMIN}
ENV VITE_ENABLE_ANALYTICS=${VITE_ENABLE_ANALYTICS}
ENV VITE_ENABLE_CONVERSION_TRACKING=${VITE_ENABLE_CONVERSION_TRACKING}
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

COPY package*.json ./

# Copy scripts and templates needed for postinstall hook
COPY scripts ./scripts
COPY templates ./templates

RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf.template /etc/nginx/nginx.conf.template
COPY nginx/docker-entrypoint.sh /docker-entrypoint.sh

# Make entrypoint executable
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
