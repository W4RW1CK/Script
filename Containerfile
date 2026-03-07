# Containerfile — Script App Development Container
#
# Base: Node 22 LTS (Bookworm slim)
# Purpose: Isolated Expo/Metro development environment
# Usage: See scripts/container-start.sh
#
# What this container provides:
#   - Node 22 + npm (exact version pinned)
#   - Watchman (Metro file watcher — avoids polling, faster bundling)
#   - Git (for pulling updates inside container)
#   - Working directory /app (project mounted as volume from host)
#
# What this container does NOT do:
#   - Android SDK / emulator (Expo Go on physical device handles this)
#   - Modify the host system in any way
#   - Store secrets (all secrets come from .env.local mounted at runtime)
#
# Ports:
#   8081  — Metro bundler
#   19000 — Expo Go tunnel/LAN
#   19001 — Expo Go hot reload
#   19002 — Expo Dev Tools (optional)

FROM node:22-bookworm-slim

# Install system dependencies
# - watchman: Metro file watcher (better than inotify polling)
# - git: for git operations inside container
# - curl: for health checks
# - procps: for process inspection (ps, top)
RUN apt-get update && apt-get install -y --no-install-recommends \
    watchman \
    git \
    curl \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Configure npm to avoid audit noise and set cache directory
RUN npm config set fund false \
    && npm config set audit false \
    && npm config set cache /tmp/npm-cache

# Expose Metro + Expo ports
EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Default command: show helpful message
# The actual start command is provided by container-start.sh
CMD ["echo", "Use scripts/container-start.sh to start the development server."]
