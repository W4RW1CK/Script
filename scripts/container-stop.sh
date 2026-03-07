#!/usr/bin/env bash
# scripts/container-stop.sh — Gracefully stop the Script dev container
#
# This script stops the running container. Your project files are NOT affected —
# they live on the host (mounted as a volume). Only the container process stops.
#
# Usage:
#   ./scripts/container-stop.sh

set -euo pipefail

CONTAINER_NAME="script-dev-server"

if ! podman container exists "$CONTAINER_NAME" 2>/dev/null; then
  echo "INFO: Container '$CONTAINER_NAME' is not running."
  exit 0
fi

echo "==> Stopping container '$CONTAINER_NAME'..."
podman stop "$CONTAINER_NAME"
echo "    Done. Your project files are intact at the mounted path."
