#!/usr/bin/env bash
# scripts/container-shell.sh — Open a shell inside the running container
#
# Use this to run commands inside the container (npm install, supabase CLI, etc.)
# without stopping the dev server.
#
# Usage:
#   ./scripts/container-shell.sh

set -euo pipefail

CONTAINER_NAME="script-dev-server"

if ! podman container exists "$CONTAINER_NAME" 2>/dev/null; then
  echo "ERROR: Container '$CONTAINER_NAME' is not running."
  echo "  Start it first: ./scripts/container-start.sh"
  exit 1
fi

echo "==> Opening shell in '$CONTAINER_NAME'..."
echo "    Type 'exit' to leave without stopping the container."
echo ""

podman exec --interactive --tty "$CONTAINER_NAME" bash
