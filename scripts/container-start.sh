#!/usr/bin/env bash
# scripts/container-start.sh — Start the Script Expo dev server in a container
#
# SAFETY NOTES:
#   - The container is READ-WRITE on /app (your project source) but isolated otherwise
#   - Host ports 8081, 19000, 19001 are forwarded — ensure they are free before running
#   - No other host directories are mounted — host data is NOT accessible inside
#   - The container runs as the default node user (non-root)
#   - Stopping the container (Ctrl+C or container-stop.sh) does NOT delete your files
#
# NETWORK:
#   The container uses bridge networking with explicit port mapping.
#   Your phone (Expo Go) connects to HOST_IP:8081 — same as running locally.
#   If Expo can't connect, check that your phone and server are on the same network.
#
# Usage:
#   chmod +x scripts/container-start.sh
#   ./scripts/container-start.sh
#
# Requirements:
#   - Podman installed on the host
#   - .env.local file present in project root (with your actual API keys)
#   - Container image built: ./scripts/container-build.sh
#   - Run from the project root directory

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
IMAGE_NAME="script-dev"
CONTAINER_NAME="script-dev-server"

# ── Safety checks ──────────────────────────────────────────────────────────────

# Check .env.local exists (required for Supabase + Privy keys)
if [ ! -f "$PROJECT_ROOT/.env.local" ]; then
  echo "ERROR: .env.local not found at $PROJECT_ROOT/.env.local"
  echo "  Copy .env.local.example and fill in your API keys."
  exit 1
fi

# Check image exists
if ! podman image exists "$IMAGE_NAME:latest" 2>/dev/null; then
  echo "ERROR: Container image '$IMAGE_NAME:latest' not found."
  echo "  Run ./scripts/container-build.sh first."
  exit 1
fi

# Check if container is already running
if podman container exists "$CONTAINER_NAME" 2>/dev/null; then
  echo "INFO: Container '$CONTAINER_NAME' is already running."
  echo "  To stop it: ./scripts/container-stop.sh"
  echo "  To attach:  podman attach $CONTAINER_NAME"
  exit 0
fi

# Check if ports are free on the host (ss is available on Fedora/all Linux)
for PORT in 8081 19000 19001; do
  if ss -tlnp 2>/dev/null | grep -q ":${PORT} "; then
    echo "WARNING: Port $PORT is already in use on the host."
    echo "  Stop the process using it before starting the container."
    echo "  Check: ss -tlnp | grep :$PORT"
  fi
done

# ── Detect host IP for Expo ────────────────────────────────────────────────────
# Expo Go on the phone needs to connect to the HOST's IP, not the container IP.
# We detect the primary non-loopback IPv4 address of the host.
HOST_IP=$(ip -4 route get 8.8.8.8 2>/dev/null | awk '{print $7; exit}' || hostname -I | awk '{print $1}')

if [ -z "$HOST_IP" ]; then
  echo "WARNING: Could not detect host IP automatically."
  echo "  Set REACT_NATIVE_PACKAGER_HOSTNAME manually in .env.local if Expo Go can't connect."
  HOST_IP="0.0.0.0"
fi

echo "==> Starting Script dev container"
echo "    Project:  $PROJECT_ROOT"
echo "    Host IP:  $HOST_IP (Expo Go will connect to this address)"
echo "    Ports:    8081 (Metro), 19000-19001 (Expo Go)"
echo ""
echo "    Press Ctrl+C to stop. Your files are safe — only the container stops."
echo ""

# ── Start container ────────────────────────────────────────────────────────────
podman run \
  --rm \
  --name "$CONTAINER_NAME" \
  --interactive \
  --tty \
  \
  `# Port mappings — Metro and Expo Go` \
  --publish 8081:8081 \
  --publish 19000:19000 \
  --publish 19001:19001 \
  --publish 19002:19002 \
  \
  `# Mount project source — read-write (edits inside container reflect on host)` \
  --volume "$PROJECT_ROOT:/app:z" \
  \
  `# Tell Expo to bind on the host IP so the phone can reach it` \
  --env "REACT_NATIVE_PACKAGER_HOSTNAME=$HOST_IP" \
  \
  `# Pass through all EXPO_PUBLIC_ vars from .env.local to the container` \
  `# (podman --env-file parses KEY=VALUE lines, ignores comments)` \
  --env-file "$PROJECT_ROOT/.env.local" \
  \
  `# Image and command` \
  "$IMAGE_NAME:latest" \
  bash -c "
    set -e
    echo '==> Container started. Installing dependencies...'
    cd /app

    # Install npm dependencies (uses volume-mounted node_modules)
    npm install --prefer-offline 2>&1 | tail -5

    echo ''
    echo '==> Starting Expo dev server...'
    echo '    Open Expo Go on your phone and scan the QR code.'
    echo '    Make sure your phone and server are on the same WiFi network.'
    echo ''

    # Start Metro with cache cleared
    npx expo start --clear --port 8081
  "
