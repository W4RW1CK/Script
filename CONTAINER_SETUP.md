# Container Setup — Script Dev Environment

Isolated Podman container for running the Expo/Metro development server.
Your host system is not modified — all dependencies run inside the container.

## Prerequisites

- Podman installed on the server (`podman --version`)
- Project cloned and `.env.local` populated with real API keys
- Phone with Expo Go on the same WiFi network as the server

## Quick Start

```bash
# 1. Build the image (once, or after Containerfile changes)
chmod +x scripts/container-build.sh
./scripts/container-build.sh

# 2. Start the dev server
chmod +x scripts/container-start.sh
./scripts/container-start.sh

# 3. Open Expo Go on your phone — scan the QR code in the terminal
```

## All Commands

| Script | Purpose |
|--------|---------|
| `scripts/container-build.sh` | Build the container image |
| `scripts/container-start.sh` | Start Metro dev server inside container |
| `scripts/container-stop.sh` | Stop the running container (files are safe) |
| `scripts/container-shell.sh` | Open a shell in the running container |

## Safety Guarantees

- **Host data is untouched** — only the project directory (`/app`) is mounted read-write
- **No network access beyond what's needed** — bridge networking with explicit port mapping
- **Stopping the container doesn't delete anything** — your source files live on the host
- **Secrets never leave `.env.local`** — passed via `--env-file` only to the container process
- **`--rm` flag** — container is automatically cleaned up when stopped (no orphaned containers)

## Ports

| Port | Service |
|------|---------|
| 8081 | Metro bundler (Expo Go connects here) |
| 19000 | Expo Go LAN |
| 19001 | Expo Go hot reload |
| 19002 | Expo Dev Tools (optional) |

## Troubleshooting

### Phone can't connect to Metro
The `container-start.sh` script auto-detects the server's IP via `ip route`.
If it gets the wrong IP, set it manually in `.env.local`:

```bash
REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.xxx  # your server's actual LAN IP
```

### Port already in use
Check what's using the port before starting:
```bash
lsof -i :8081
# or
ss -tlnp | grep 8081
```

### Rebuilding after dependency changes
If you add new packages to `package.json`, you don't need to rebuild the image.
`npm install` runs automatically inside the container on each start.
Only rebuild the image if `Containerfile` changes (new system packages, etc.).

### Watchman errors
Watchman is included in the image. If you see watchman permission errors:
```bash
# Inside container (via container-shell.sh):
watchman watch-del-all
watchman shutdown-server
# Then restart the container
```

## Architecture

```
Host machine
├── /path/to/Script/          ← your source (safe, on host)
│   ├── .env.local            ← secrets (never committed)
│   ├── Containerfile
│   └── scripts/
│       ├── container-build.sh
│       ├── container-start.sh
│       ├── container-stop.sh
│       └── container-shell.sh
│
└── Podman container: script-dev-server
    ├── /app  →  mounted from host Script/
    ├── node:22 + watchman
    └── Metro bundler on :8081
              ↕ port mapping
        Phone (Expo Go) → HOST_IP:8081
```
