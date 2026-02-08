#!/bin/bash

# JWT Secret Generator
# This script generates a secure JWT secret key

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}            JWT Secret Generator                        ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Try to generate using openssl
if command -v openssl >/dev/null 2>&1; then
    JWT_SECRET=$(openssl rand -base64 48 | tr -d '\n')
    echo -e "${GREEN}Generated JWT Secret:${NC}"
    echo "$JWT_SECRET"
else
    # Fallback to /dev/urandom
    JWT_SECRET=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 48)
    echo -e "${GREEN}Generated JWT Secret:${NC}"
    echo "$JWT_SECRET"
fi

echo ""
echo "Copy this value to your .env.docker file:"
echo "JWT_SECRET=$JWT_SECRET"
echo ""
