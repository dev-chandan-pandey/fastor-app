# Fastor — React + Express + MongoDB

Responsive React/Vite food-ordering frontend with an Express API, MongoDB models, JWT sessions, Twilio Verify SMS OTP, validated endpoints, centralized error handling, and API service modules. The existing UI styling is retained.

## Requirements
- Node.js 20+
- MongoDB local instance or MongoDB Atlas
- Twilio account with a Verify service for real SMS OTP

## 1. Start the backend
```bash
cd server
cp .env.example .env
# Edit .env: set MONGODB_URI, a strong JWT_SECRET, and Twilio Verify credentials.
npm install
npm run seed
npm run dev
```
The API listens at `http://localhost:4000`. Check `GET /api/health`.

For real SMS delivery configure `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_VERIFY_SERVICE_SID`. The backend uses Twilio Verify so OTP issuance, expiration and verification are handled by the provider. Do not commit `.env` or credentials.

**Development only:** without Twilio, SMS requests are disabled by default. To test the end-to-end flow without sending SMS, set `OTP_DEV_RETURN_CODE=true` in a non-production backend `.env`. The response includes a development OTP. Never enable this setting in production; the backend explicitly refuses this fallback when `NODE_ENV=production`.

## 2. Start the frontend
In a separate terminal:
```bash
cd ..
cp .env.example .env
npm install
npm run dev
```
`VITE_API_BASE_URL` defaults to `http://localhost:4000/api`. Change it if your API runs elsewhere. Frontend requests use `src/api/` modules and send JWTs as Bearer tokens.

## API routes
- `GET /api/health`
- `POST /api/auth/otp/request` — `{ "phone": "+919876543210" }`
- `POST /api/auth/otp/verify` — `{ "phone": "+919876543210", "code": "123456" }`
- `GET /api/auth/me` — Bearer token
- `GET /api/products?q=&category=&veg=&sort=`
- `GET /api/products/categories`
- `POST /api/orders` — authenticated; `{ "items": [{ "productId": "pizza", "quantity": 1 }], "address": "Home, New Delhi", "instructions": "less spicy", "paymentMethod": "cash" }`
- `GET /api/orders`, `GET /api/orders/:id`, `POST /api/orders/:id/cancel` — authenticated
- `GET /api/profile`, `PATCH /api/profile` with `{ "name": "Karan" }` — authenticated

Success responses have `{ success: true, data }`. Errors have `{ success: false, error: { message, details? } }`.

## Security notes
- OTP request throttling, per-number cooldown, attempt limit, expiry, Twilio Verify and request validation are configured.
- JWT secret is required to start the server; production requires at least 32 characters.
- Helmet, CORS allowlist, JSON size limits and centralized error handling are enabled.
- Orders are calculated server-side using current product prices and are scoped to the authenticated user.
- Payment currently supports cash-on-delivery only. Integrate a payment provider before accepting online payments.
- Add production monitoring, backups, SMS spend limits, address management and deployment secrets before launch.

## Frontend integration status
- Real SMS OTP request and verification are connected to the auth UI.
- Product catalog is loaded from the API with a local fallback if the API is unavailable.
- Checkout posts the cart to the API and the orders screen reads backend orders.
- API service modules are separated into auth, products, orders and profile.
- The profile update service is available for wiring into the existing profile editor; saved address management and online payments are future work.

## Build checks
Run `npm run build` in the frontend directory and `npm start` in `server` after environment setup. A live MongoDB/Twilio integration test requires your own credentials and services.
