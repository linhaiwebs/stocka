#!/bin/bash

# List All Deployments
# This script lists all running Docker containers for this project

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}          Active Deployments Overview                  ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Check if docker is available
if ! command -v docker >/dev/null 2>&1; then
    echo -e "${YELLOW}Docker is not installed or not in PATH${NC}"
    exit 1
fi

# Find all running containers related to this project
echo -e "${GREEN}Running Containers:${NC}"
echo ""

# Get all containers with names matching common patterns
CONTAINERS=$(docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(frontend|backend)" || echo "")

if [ -z "$CONTAINERS" ]; then
    echo "No active deployments found."
else
    echo "$CONTAINERS"
fi

echo ""
echo -e "${GREEN}Docker Volumes:${NC}"
echo ""

# List volumes
VOLUMES=$(docker volume ls --format "{{.Name}}" | grep -E "(backend-data|backend-backups)" || echo "")

if [ -z "$VOLUMES" ]; then
    echo "No project volumes found."
else
    for volume in $VOLUMES; do
        SIZE=$(docker system df -v 2>/dev/null | grep "$volume" | awk '{print $3}' || echo "unknown")
        echo "  - $volume (Size: $SIZE)"
    done
fi

echo ""
echo -e "${GREEN}Docker Networks:${NC}"
echo ""

# List networks
NETWORKS=$(docker network ls --format "{{.Name}}" | grep -E "network" | grep -v "bridge" | grep -v "host" | grep -v "none" || echo "")

if [ -z "$NETWORKS" ]; then
    echo "No project networks found."
else
    for network in $NETWORKS; do
        echo "  - $network"
    done
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Show quick commands
echo "Useful commands:"
echo "  docker ps -a                          # Show all containers"
echo "  docker volume ls                      # Show all volumes"
echo "  docker network ls                     # Show all networks"
echo "  docker logs <container-name>          # View container logs"
echo "  docker exec -it <container-name> sh   # Access container shell"
echo ""
