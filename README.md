# Fastor — Food Ordering App

Fastor is a full-stack food-ordering project built with React + Vite on the frontend and Node.js + Express on the backend. MongoDB stores application data, and Twilio Verify can deliver SMS OTP codes.

This repository contains both the frontend and backend. Deploy them as separate services:
- **Frontend:** Vercel
- **Backend API:** Render
- **Database:** MongoDB Atlas
- **SMS verification:** Twilio Verify (optional for local demo; trial limits apply)

> **Assignment/demo project:** Before accepting real users or orders, verify authentication, authorization, checkout, error handling, and recovery procedures. A successful frontend build alone does not prove the whole system is production-ready.

## Features

- Responsive food-ordering UI for desktop and mobile
- React/Vite frontend
- Express REST API
- MongoDB persistence for users, products, and orders
- OTP authentication through Twilio Verify
- Development-only OTP fallback (must remain disabled in production)
- Order pricing calculated on the server
- Backend unit tests for order-pricing utilities

## Repository layout

```text
fastor-app/
├── index.html
├── package.json                 # Frontend scripts and dependencies
├── src/                         # React frontend
├── .env.example                 # Frontend environment example, if used
├── server/
│   ├── package.json             # Backend scripts and dependencies
│   ├── .env.example             # Backend environment example
│   ├── src/
│   │   ├── server.js            # API entry point
│   │   ├── app.js               # Express app (if present)
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   └── test/
└── README.md
```

Names can vary slightly depending on the current project version. Use the scripts in each `package.json` as the source of truth.

## Requirements

- Node.js LTS and npm
- Git
- MongoDB Atlas account or a reachable MongoDB instance
- Twilio account and Verify service for real SMS OTP (optional for local demo)

Check versions:

```bash
node --version
npm --version
git --version
```

## Local setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/fastor-app.git
cd fastor-app
```

### 2. Install frontend dependencies

From the repository root:

```bash
npm install
```

### 3. Configure the backend

Create `server/.env` by copying `server/.env.example`:

**Git Bash**
```bash
cp server/.env.example server/.env
```

**PowerShell**
```powershell
Copy-Item server/.env.example server/.env
```

Set the environment variables described below. Never commit `server/.env`.

### 4. Start the backend

```bash
cd server
npm install
npm run start
```

If the `server/package.json` defines a development script, you may use `npm run dev` for local development. The API in the current setup uses port `4000` locally unless overridden.

### 5. Start the frontend

Open a second terminal at the repository root:

```bash
npm run dev
```

Vite typically serves the frontend at `http://localhost:5173`.

## Environment variables

### Backend — `server/.env`

Use the exact variable names read by `server/src/config/env.js` (or the current configuration module). The following reflects the current setup:

```dotenv
NODE_ENV=development
PORT=4000
CLIENT_ORIGIN=http://localhost:5173

MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=GENERATE_A_RANDOM_SECRET
JWT_EXPIRES_IN=7d

OTP_TTL_MINUTES=5
OTP_MAX_ATTEMPTS=5

TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN
TWILIO_VERIFY_SERVICE_SID=YOUR_TWILIO_VERIFY_SERVICE_SID

# Local demo only, if supported by this project:
OTP_DEV_RETURN_CODE=true
```

Important:
- Do not copy credentials from screenshots, chat messages, or another application's `.env`.
- Generate a strong JWT secret locally, for example:

  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```

- `MONGODB_URI` must point to the intended Fastor database. Keep database credentials private and URL-encode special characters in the password.
- `TWILIO_ACCOUNT_SID` starts with `AC`; the Verify Service SID starts with `VA`. An Auth Token is neither of those.
- Trial accounts may send OTP only under Twilio's trial restrictions, including verified recipient limitations and trial balance/expiry rules.
- If Twilio is not configured and the application supports a development OTP fallback, use it only locally. Set `OTP_DEV_RETURN_CODE=false` in deployed environments.
- Environment-variable names must match the backend's config code. If it expects `MONGO_URI` instead of `MONGODB_URI`, use the exact name expected by the code.

### Frontend — Vite

Set the API URL used by the frontend API client. The current client may expect:

```dotenv
VITE_API_BASE_URL=http://localhost:4000/api
```

Confirm the name and whether `/api` is included by checking `src/api/client.js`. Vite variables prefixed with `VITE_` are exposed to browser code. **Never put passwords, JWT signing secrets, or Twilio Auth Tokens in frontend variables.**

## API and connectivity checks

1. Start MongoDB/Atlas connectivity by starting the backend.
2. Confirm the startup log reports a successful database connection and the API listening on the expected port.
3. Check the health endpoint if configured (for example, `/health`).
4. Open the frontend and test requesting an OTP, verifying it, loading products, and creating/viewing an order.
5. If a request fails, inspect the browser DevTools Network tab and the backend logs. Redact credentials and personal data before sharing logs.

## Tests and production build

From the repository root:

```bash
npm install
npm run build
```

Run backend tests from the server folder:

```bash
cd server
npm install
npm test
```

The available test command depends on `server/package.json`. If `npm test` is not defined, inspect its `scripts` section and use the configured test command.

## Deployment

### Backend on Render

1. Push the repository to GitHub without any `.env` files or secrets.
2. In Render, create **New → Web Service** and connect the repository.
3. Set **Root Directory** to `server`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `npm start` (verify this script exists in `server/package.json`).
6. Add the backend environment variables in Render's Environment section:
   - `NODE_ENV=production`
   - `MONGODB_URI`
   - `JWT_SECRET` (new strong value)
   - `JWT_EXPIRES_IN`
   - `CLIENT_ORIGIN` (the deployed Vercel origin)
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_VERIFY_SERVICE_SID`
   - `OTP_TTL_MINUTES`
   - `OTP_MAX_ATTEMPTS`
   - `OTP_DEV_RETURN_CODE=false`
7. Configure MongoDB Atlas network access so the deployed API can connect. Prefer restricted access where practical.
8. Deploy and inspect Render logs. Copy the service's public URL.

Render provides the port in `PORT` for web services. The server should listen on `process.env.PORT` and bind to `0.0.0.0` if required by its host environment.

### Frontend on Vercel

1. Import the GitHub repository into Vercel.
2. Set the framework to **Vite**.
3. Set the root directory to the repository root (`./`).
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add the frontend environment variable, using the actual Render URL:

   ```dotenv
   VITE_API_BASE_URL=https://YOUR-RENDER-SERVICE.onrender.com/api
   ```

7. Deploy. After Vercel gives you a URL, update Render's `CLIENT_ORIGIN` to that exact origin (for example, `https://your-app.vercel.app`) and redeploy/restart the backend.
8. Redeploy the frontend whenever a Vite environment variable changes.

Check `src/api/client.js` to confirm the correct variable name and API path before deploying.

## Pre-deployment checklist

- [ ] `server/.env` and all other secret files are excluded from Git.
- [ ] `.env.example` files contain placeholders only.
- [ ] MongoDB credentials have been rotated if previously shared or committed.
- [ ] Twilio Auth Token has been rotated if previously shared or committed.
- [ ] A new strong `JWT_SECRET` is configured in Render.
- [ ] `OTP_DEV_RETURN_CODE=false` in deployed environments.
- [ ] `CLIENT_ORIGIN` is the exact Vercel origin.
- [ ] Frontend API base URL points to the deployed Render API.
- [ ] Production build and backend tests pass.
- [ ] Real trial OTP, login, product loading, checkout, and order history have been tested.
- [ ] Users cannot read or change another user's orders.
- [ ] Database backups/recovery and error logging are considered before real users are accepted.

## Git secret safety

Never commit `.env` files, database URLs with passwords, JWT secrets, or Twilio credentials. A recommended `.gitignore` includes:

```gitignore
node_modules/
dist/
.env
.env.*
!.env.example
server/.env
server/node_modules/
```

If GitHub push protection detects a credential, remove it from the commit history; do not bypass secret scanning. Rotate any credential that was exposed.

## Troubleshooting

- **`querySrv ECONNREFUSED`**: DNS SRV lookup is failing. Check DNS/network and use the exact standard connection string supplied by Atlas if appropriate.
- **MongoDB authentication failed**: verify the Atlas database username/password, authentication database, URL encoding, and database user's permissions.
- **IP/network access error**: check Atlas Network Access and the deployment host's outbound connectivity.
- **Twilio `20404` / Verify service not found**: `TWILIO_VERIFY_SERVICE_SID` must be the actual Verify Service SID beginning with `VA`, not the Account SID (`AC`) or Auth Token.
- **CORS error**: set `CLIENT_ORIGIN` to the exact frontend origin, including `https://` and without a trailing slash unless your implementation normalizes it.
- **Frontend API requests fail**: check `VITE_API_BASE_URL`, the API route prefix, Render logs, and whether the backend is awake.
- **JWT errors after deployment**: confirm the same strong `JWT_SECRET` remains configured across backend restarts and that issuer/audience settings match the authentication middleware.

## License

Add a license appropriate to your assignment or intended distribution. If this is a college assignment, follow your institution's submission and attribution requirements.
