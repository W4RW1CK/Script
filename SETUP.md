# SETUP.md — New Machine Setup Guide

> Complete environment setup for the Script app (Expo + Supabase).
> Follow each step in order. Estimated time: ~20 minutes.

---

## 1. Prerequisites

```bash
# Install Node.js v22 (use nvm — do NOT use system node)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc   # or ~/.zshrc
nvm install 22
nvm use 22
node --version     # should print v22.x.x

# Install Supabase CLI
npm install -g supabase

# Install EAS CLI (for future builds)
npm install -g eas-cli
```

---

## 2. Clone the repo

```bash
git clone https://github.com/W4RW1CK/Script.git
cd Script
git checkout dev       # always work on dev, never directly on main
```

---

## 3. Install dependencies

```bash
npm install            # always npm — never bun or yarn
```

---

## 4. Environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in the values (ask w4rw1ck for them — never share in chat):

| Variable | Where to find it |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → anon/public |
| `EXPO_PUBLIC_PRIVY_APP_ID` | dashboard.privy.io → Script Mobile → App ID |
| `EXPO_PUBLIC_PRIVY_CLIENT_ID` | dashboard.privy.io → Script Mobile → Settings → Clients |

---

## 5. Supabase CLI login

```bash
supabase login
# Opens browser → paste your Supabase access token
# Token: Supabase Dashboard → Account → Access Tokens
```

---

## 6. Firewall (Linux only — skip on Mac)

### Fedora:
```bash
sudo firewall-cmd --zone=FedoraServer --add-port=8081/tcp --permanent
sudo firewall-cmd --zone=FedoraServer --add-port=19000/tcp --permanent
sudo firewall-cmd --zone=FedoraServer --add-port=19001/tcp --permanent
sudo firewall-cmd --reload
```

### Ubuntu/Debian:
```bash
sudo ufw allow 8081
sudo ufw allow 19000
sudo ufw allow 19001
```

---

## 7. Start the dev server

```bash
npx expo start --clear --host lan
```

Scan the QR code with **Expo Go** on Android.

> ⚠️ The `--host lan` flag is required for physical device testing on the same network.
> ⚠️ `--clear` clears Metro's bundler cache — always use it after pulling new code.

---

## 8. Deploy Edge Functions (run once, re-run after any function change)

> ⚠️ All functions MUST be deployed with `--no-verify-jwt`.
> The Supabase Publishable key format (`sb_...`) is NOT a JWT — default verification returns 401.

```bash
# Project ref: dijyzkxnnyvonpknkbpp
supabase functions deploy sync-privy-user \
  --project-ref dijyzkxnnyvonpknkbpp \
  --no-verify-jwt

supabase functions deploy interpret-checkin \
  --project-ref dijyzkxnnyvonpknkbpp \
  --no-verify-jwt
```

### Edge Function secrets (set once per project — already configured, but verify):
```bash
# Check existing secrets:
supabase secrets list --project-ref dijyzkxnnyvonpknkbpp

# Set if missing:
supabase secrets set OPENAI_API_KEY=sk-... --project-ref dijyzkxnnyvonpknkbpp
# SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-injected by Supabase
```

---

## 9. Verify everything works

1. Open Expo Go → scan QR
2. Log in with email (magic link)
3. Check Metro terminal — you should see:
   ```
   LOG [Supabase] Session activated via verifyOtp — RLS enabled
   ```
   NOT:
   ```
   WARN [Supabase] Error activating session: Email link is invalid or has expired
   ```
4. Go to Check-in → complete a check-in
5. Go to History → your check-in should appear

---

## 10. Daily workflow

```bash
# Pull latest code
git restore package-lock.json && git pull origin dev

# If package.json changed (new deps):
npm install

# Start dev server
npx expo start --clear --host lan

# After changing an Edge Function:
supabase functions deploy <function-name> \
  --project-ref dijyzkxnnyvonpknkbpp \
  --no-verify-jwt
```

---

## Key project info

| Item | Value |
|---|---|
| Supabase project | `dijyzkxnnyvonpknkbpp` |
| Supabase dashboard | `https://supabase.com/dashboard/project/dijyzkxnnyvonpknkbpp` |
| Expo SDK | 55 |
| React | 19 |
| Package manager | npm (never bun/yarn) |
| Dev branch | `dev` |
| Privy dashboard | `dashboard.privy.io` |
| App bundle ID (Expo Go) | `host.exp.exponent` |

---

## Common errors & fixes

| Error | Fix |
|---|---|
| `Email link is invalid or has expired` | Redeploy `sync-privy-user` with `--no-verify-jwt` |
| `Edge Function returned a non-2xx status code` | Redeploy `interpret-checkin` with `--no-verify-jwt` |
| `expo-symbols` import error | Run `npm uninstall expo-symbols` |
| Metro can't reach phone | Use `--host lan`, check firewall ports |
| White flash on launch | Ensure `backgroundColor: "#fffbf5"` in `app.json` |
| History shows empty | Session not established → redeploy + fresh login |
