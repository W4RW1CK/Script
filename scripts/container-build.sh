#!/usr/bin/env bash
# scripts/container-build.sh — Build the Script dev container image
#
# Run this ONCE before starting the container, and again after
# any changes to Containerfile or system dependencies.
#
# Usage:
#   chmod +x scripts/container-build.sh
#   ./scripts/container-build.sh
#
# Requirements:
#   - Podman installed on the host
#   - Run from the project root directory

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
IMAGE_NAME="script-dev"

echo "==> Building Script dev container image..."
echo "    Project root: $PROJECT_ROOT"
echo "    Image name:   $IMAGE_NAME"
echo ""

# Build from project root (where Containerfile is located)
podman build \
  --tag "$IMAGE_NAME:latest" \
  --file "$PROJECT_ROOT/Containerfile" \
  "$PROJECT_ROOT"

echo ""
echo "==> Build complete. Image: $IMAGE_NAME:latest"
echo "    Run ./scripts/container-start.sh to start development."
