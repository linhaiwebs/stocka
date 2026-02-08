#!/bin/bash

# Docker Deployment Script for Landing Page Management System
# This script handles the complete deployment process using Docker

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

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Landing Page Management System - Docker Deployment  ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Check prerequisites
print_status "Checking prerequisites..."

if ! command_exists docker; then
    print_error "Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command_exists docker-compose; then
    if ! docker compose version >/dev/null 2>&1; then
        print_error "Docker Compose is not installed."
        exit 1
    else
        DOCKER_COMPOSE_CMD="docker compose"
    fi
else
    DOCKER_COMPOSE_CMD="docker-compose"
fi

print_success "Docker and Docker Compose are installed"

if ! docker info >/dev/null 2>&1; then
    print_error "Docker daemon is not running. Please start Docker first."
    exit 1
fi

print_success "Docker daemon is running"

# Check environment file
print_status "Checking environment configuration..."

if [ ! -f ".env.docker" ]; then
    print_warning ".env.docker not found. Creating from example..."
    if [ -f ".env.docker.example" ]; then
        cp .env.docker.example .env.docker
        print_warning "Please edit .env.docker and configure your settings!"
        echo ""
        echo "Required configurations:"
        echo "  - JWT_SECRET: Generate with 'openssl rand -base64 32'"
        echo "  - ADMIN_PASSWORD: Set a strong password"
        echo ""
        read -p "Press Enter after configuring .env.docker to continue..."
    else
        print_error ".env.docker.example not found!"
        exit 1
    fi
fi

print_success "Environment configuration found"

# Stop existing containers
print_status "Stopping existing containers (if any)..."
$DOCKER_COMPOSE_CMD --env-file .env.docker down 2>/dev/null || true
print_success "Existing containers stopped"

# Clean caches
print_status "Cleaning build caches..."

# Clean frontend caches
if [ -d "node_modules" ]; then
    print_status "Removing frontend node_modules..."
    rm -rf node_modules
fi

if [ -d ".vite" ]; then
    print_status "Removing Vite cache..."
    rm -rf .vite
fi

if [ -d "dist" ]; then
    print_status "Removing dist folder..."
    rm -rf dist
fi

# Clean backend caches
if [ -d "backend/node_modules" ]; then
    print_status "Removing backend node_modules..."
    rm -rf backend/node_modules
fi

if [ -d "backend/dist" ]; then
    print_status "Removing backend dist..."
    rm -rf backend/dist
fi

# Clean Docker build cache
print_status "Pruning Docker build cache..."
docker builder prune -f >/dev/null 2>&1 || true

print_success "Cache cleanup completed"

# Reinstall dependencies
print_status "Installing fresh dependencies..."
npm install --silent >/dev/null 2>&1 || print_warning "Frontend npm install failed (will retry in Docker)"
cd backend && npm install --silent >/dev/null 2>&1 || print_warning "Backend npm install failed (will retry in Docker)"
cd ..

# Generate template registry
print_status "Generating template registry..."
node scripts/generate-template-registry.js || print_warning "Template registry generation failed"

print_success "Dependencies installed"

# Build Docker images
print_status "Building Docker images..."
$DOCKER_COMPOSE_CMD --env-file .env.docker build --no-cache

if [ $? -eq 0 ]; then
    print_success "Docker images built successfully"
else
    print_error "Failed to build Docker images"
    exit 1
fi

# Start containers
print_status "Starting containers..."
$DOCKER_COMPOSE_CMD --env-file .env.docker up -d

if [ $? -eq 0 ]; then
    print_success "Containers started successfully"
else
    print_error "Failed to start containers"
    exit 1
fi

# Wait for services
print_status "Waiting for services to be ready..."
sleep 10

# Health check
print_status "Performing health check..."

# Get backend port from .env.docker
BACKEND_PORT=$(grep -E "^BACKEND_PORT=" .env.docker | cut -d '=' -f2 | tr -d ' ' || echo "3001")
BACKEND_PORT=${BACKEND_PORT:-3001}

BACKEND_HEALTH=$(docker exec landing-page-backend wget -qO- http://localhost:${BACKEND_PORT}/health 2>/dev/null || echo "failed")

if [ "$BACKEND_HEALTH" != "failed" ]; then
    print_success "Backend is healthy"
else
    print_warning "Backend health check failed. Check logs with: $DOCKER_COMPOSE_CMD logs backend"
fi

FRONTEND_HEALTH=$(docker exec landing-page-frontend wget -qO- http://localhost/ 2>/dev/null || echo "failed")

if [ "$FRONTEND_HEALTH" != "failed" ]; then
    print_success "Frontend is healthy"
else
    print_warning "Frontend health check failed. Check logs with: $DOCKER_COMPOSE_CMD logs frontend"
fi

# Verify React template component code (optional check)
print_status "Verifying React template setup..."
sleep 2

REACT_CHECK=$(docker exec landing-page-backend sh -c "node -e \"
const db = require('better-sqlite3')('/app/data/landing_pages.db');
const templates = db.prepare('SELECT COUNT(*) as count FROM templates WHERE template_type = \\'react\\'').get();
const withCode = db.prepare('SELECT COUNT(*) as count FROM templates WHERE template_type = \\'react\\' AND component_code IS NOT NULL').get();
console.log(JSON.stringify({total: templates.count, withCode: withCode.count}));
\"" 2>/dev/null || echo '{"total":0,"withCode":0}')

REACT_TOTAL=$(echo "$REACT_CHECK" | grep -o '"total":[0-9]*' | cut -d':' -f2 || echo "0")
REACT_WITH_CODE=$(echo "$REACT_CHECK" | grep -o '"withCode":[0-9]*' | cut -d':' -f2 || echo "0")

if [ "$REACT_TOTAL" -gt 0 ]; then
    if [ "$REACT_WITH_CODE" -eq "$REACT_TOTAL" ]; then
        print_success "React templates verified ($REACT_WITH_CODE/$REACT_TOTAL have component code)"
    else
        print_warning "React templates: $REACT_WITH_CODE/$REACT_TOTAL have component code"
        echo "  Some React templates may not be fully functional"
        echo "  Check backend logs: docker logs landing-page-backend"
    fi
else
    print_status "No React templates found (HTML templates only)"
fi

# Verify template categories
print_status "Verifying template categories..."
sleep 1

CATEGORY_CHECK=$(docker exec landing-page-backend sh -c "node -e \"
const db = require('better-sqlite3')('/app/data/landing_pages.db');
const inputForm = db.prepare('SELECT COUNT(*) as count FROM templates WHERE template_category = \\'input-form\\'').get();
const standard = db.prepare('SELECT COUNT(*) as count FROM templates WHERE template_category = \\'standard\\'').get();
const free = db.prepare('SELECT COUNT(*) as count FROM templates WHERE template_category = \\'free\\'').get();
console.log(JSON.stringify({inputForm: inputForm.count, standard: standard.count, free: free.count}));
\"" 2>/dev/null || echo '{"inputForm":0,"standard":0,"free":0}')

INPUT_FORM_COUNT=$(echo "$CATEGORY_CHECK" | grep -o '"inputForm":[0-9]*' | cut -d':' -f2 || echo "0")
STANDARD_COUNT=$(echo "$CATEGORY_CHECK" | grep -o '"standard":[0-9]*' | cut -d':' -f2 || echo "0")
FREE_COUNT=$(echo "$CATEGORY_CHECK" | grep -o '"free":[0-9]*' | cut -d':' -f2 || echo "0")
TOTAL_TEMPLATES=$((INPUT_FORM_COUNT + STANDARD_COUNT + FREE_COUNT))

if [ "$TOTAL_TEMPLATES" -gt 0 ]; then
    print_success "Template categories verified:"
    echo "  Input-form: $INPUT_FORM_COUNT"
    echo "  Standard: $STANDARD_COUNT"
    echo "  Free: $FREE_COUNT"
    echo "  Total: $TOTAL_TEMPLATES"
else
    print_warning "No templates found in database"
fi

# Display summary
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}              Deployment Completed!                    ${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""

FRONTEND_PORT=$(grep FRONTEND_PORT .env.docker | cut -d '=' -f2 || echo "80")

echo "Your application is now running!"
echo ""
echo "Access URLs:"
echo "  Frontend: http://localhost:${FRONTEND_PORT}"
echo "  Admin Panel: http://localhost:${FRONTEND_PORT}/admin"
echo ""
echo "Useful commands:"
echo "  View logs: $DOCKER_COMPOSE_CMD logs -f"
echo "  Stop: $DOCKER_COMPOSE_CMD down"
echo "  Restart: $DOCKER_COMPOSE_CMD restart"
echo "  Status: $DOCKER_COMPOSE_CMD ps"
echo ""
echo "For production with Cloudflare:"
echo "  1. Point your domain DNS to this server"
echo "  2. Enable Cloudflare proxy (orange cloud)"
echo "  3. Update CORS_ORIGIN in .env.docker"
echo "  4. Restart: $DOCKER_COMPOSE_CMD restart"
echo ""

print_success "Deployment script completed!"
