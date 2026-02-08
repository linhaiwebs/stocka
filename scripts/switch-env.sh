#!/bin/bash

# Environment Switching Script
# This script helps switch between different project environment files

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}       Environment Switcher - Multi-Deployment         ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Show usage if no argument provided
if [ -z "$1" ]; then
    echo "Usage: bash scripts/switch-env.sh <project-name>"
    echo ""
    echo "Available environment files:"
    echo ""

    for env_file in .env.docker.*; do
        if [ -f "$env_file" ] && [ "$env_file" != ".env.docker.example" ]; then
            project_name=$(basename "$env_file" | sed 's/.env.docker.//')

            if [ -f "$env_file" ]; then
                compose_name=$(grep -E "^COMPOSE_PROJECT_NAME=" "$env_file" | cut -d '=' -f2 | tr -d ' "' || echo "N/A")
                frontend_port=$(grep -E "^FRONTEND_PORT=" "$env_file" | cut -d '=' -f2 | tr -d ' ' || echo "N/A")
                domain=$(grep -E "^FRONTEND_MAIN_DOMAIN=" "$env_file" | cut -d '=' -f2 | tr -d ' ' || echo "N/A")

                echo "  - $project_name"
                echo "    Project: $compose_name"
                echo "    Port: $frontend_port"
                echo "    Domain: $domain"
                echo ""
            fi
        fi
    done

    echo "Example:"
    echo "  bash scripts/switch-env.sh project1"
    echo "  npm run docker:deploy"
    echo ""
    exit 0
fi

PROJECT_NAME="$1"
SOURCE_FILE=".env.docker.${PROJECT_NAME}"
TARGET_FILE=".env.docker"

# Check if source file exists
if [ ! -f "$SOURCE_FILE" ]; then
    print_error "Environment file not found: $SOURCE_FILE"
    echo ""
    echo "Available environment files:"
    ls -1 .env.docker.* 2>/dev/null | grep -v ".env.docker.example" || echo "  No environment files found"
    exit 1
fi

# Backup current .env.docker if it exists
if [ -f "$TARGET_FILE" ]; then
    CURRENT_PROJECT=$(grep -E "^COMPOSE_PROJECT_NAME=" "$TARGET_FILE" | cut -d '=' -f2 | tr -d ' "' || echo "unknown")
    print_status "Backing up current environment (project: $CURRENT_PROJECT)"
    cp "$TARGET_FILE" "${TARGET_FILE}.backup"
    print_success "Backup created: ${TARGET_FILE}.backup"
fi

# Copy the selected environment file
print_status "Switching to project: $PROJECT_NAME"
cp "$SOURCE_FILE" "$TARGET_FILE"

# Display project info
COMPOSE_NAME=$(grep -E "^COMPOSE_PROJECT_NAME=" "$TARGET_FILE" | cut -d '=' -f2 | tr -d ' "' || echo "N/A")
FRONTEND_PORT=$(grep -E "^FRONTEND_PORT=" "$TARGET_FILE" | cut -d '=' -f2 | tr -d ' ' || echo "N/A")
DOMAIN=$(grep -E "^FRONTEND_MAIN_DOMAIN=" "$TARGET_FILE" | cut -d '=' -f2 | tr -d ' ' || echo "N/A")

echo ""
print_success "Environment switched successfully!"
echo ""
echo "Current configuration:"
echo "  Project Name: $COMPOSE_NAME"
echo "  Frontend Port: $FRONTEND_PORT"
echo "  Domain: $DOMAIN"
echo ""
echo "Next steps:"
echo "  1. Review .env.docker and adjust any settings if needed"
echo "  2. Run: npm run docker:deploy"
echo ""
