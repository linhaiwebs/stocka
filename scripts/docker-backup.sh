#!/bin/bash

# Docker Backup Script for Landing Page Management System

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
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

BACKUP_DIR="./docker-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${TIMESTAMP}.tar.gz"

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    Landing Page System - Docker Backup Utility       ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

if ! docker ps | grep -q landing-page-backend; then
    print_error "Backend container is not running!"
    exit 1
fi

print_status "Creating backup directory..."
mkdir -p "$BACKUP_DIR"

TEMP_DIR=$(mktemp -d)
print_status "Using temporary directory: $TEMP_DIR"

print_status "Backing up database..."
docker cp landing-page-backend:/app/data "$TEMP_DIR/"
if [ $? -eq 0 ]; then
    print_success "Database backed up"
else
    print_error "Database backup failed"
    rm -rf "$TEMP_DIR"
    exit 1
fi

print_status "Backing up previous backups..."
docker cp landing-page-backend:/app/backups "$TEMP_DIR/" 2>/dev/null || print_status "No previous backups found"

print_status "Creating compressed archive..."
cd "$TEMP_DIR"
tar -czf "$BACKUP_FILE" data backups 2>/dev/null || tar -czf "$BACKUP_FILE" data

mv "$BACKUP_FILE" "../$BACKUP_DIR/"
cd - > /dev/null

rm -rf "$TEMP_DIR"

BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)

echo ""
print_success "Backup completed successfully!"
echo ""
echo "Backup details:"
echo "  File: $BACKUP_DIR/$BACKUP_FILE"
echo "  Size: $BACKUP_SIZE"
echo "  Date: $(date)"
echo ""

print_status "Recent backups:"
ls -lh "$BACKUP_DIR" | tail -n 5

print_status "Cleaning up old backups (keeping last 7 days)..."
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +7 -delete 2>/dev/null || true

echo ""
echo "To restore from this backup:"
echo "  1. Stop containers: docker-compose down"
echo "  2. Extract: tar -xzf $BACKUP_DIR/$BACKUP_FILE"
echo "  3. Restart containers: docker-compose up -d"
echo ""

print_success "Backup script completed!"
