#!/bin/sh
set -e

# Set default BACKEND_PORT if not provided
export BACKEND_PORT=${BACKEND_PORT:-3001}

echo "Generating nginx.conf from template..."
echo "Using BACKEND_PORT: ${BACKEND_PORT}"

# Replace environment variables in template
envsubst '${BACKEND_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

echo "nginx.conf generated successfully"

# Start nginx
exec nginx -g 'daemon off;'
