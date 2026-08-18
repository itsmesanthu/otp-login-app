# Harbor Checkout — OTP Based User Login

An original full-stack solution for the **OTP Based User Login** hiring assignment. A customer registers with their name and email, receives a six-digit login code, and is recognized while entering checkout information. They can verify the code to attach the checkout to their account or continue as a guest.

## Features

- Registration with server-side validation and secure six-digit code generation.
- The raw code is displayed once after registration, as required for the assignment; the database stores only a Django hash.
- Debounced (450 ms) email recognition while the customer continues completing checkout fields.
- OTP modal with valid six-digit input validation, clear errors, and a guest checkout option.
- Signed, two-hour checkout token issued only after OTP verification.
- Country/dial-code selector with E.164 phone normalization (for example, `+919876543210`).
- Guest orders are supported and have a nullable `user_id`; verified orders are linked to the customer.
- Responsive React UI, accessible labels, loading states, validation, and error handling.
- PostgreSQL schema file and Django migrations included.

## Architecture

```text
React + Vite (frontend)  →  Django REST Framework API  →  PostgreSQL
                                    │
                         Django ORM / migrations
```

The browser never connects directly to the database.

## Project layout

```text
.
├── frontend/              # React + JavaScript + Vite
├── backend/               # Django + Django REST Framework
│   ├── users/             # Registration, recognition, OTP verification
│   └── checkout/          # Checkout persistence
├── database/schema.sql    # PostgreSQL schema required by the assignment
└── prompts.md             # Development prompt record
```

## Run locally

### 1. API

Requires Python 3.10+.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Without `DATABASE_URL`, Django uses `backend/db.sqlite3` for local convenience. This file is ignored by Git. To run against PostgreSQL, copy `backend/.env.example` to `backend/.env`, set `DATABASE_URL`, and export its values before starting Django (or configure them in your deployment platform).

### 2. Frontend

In another terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open the printed Vite URL (normally `http://localhost:5173`). `VITE_API_BASE_URL` defaults to `http://localhost:8000/api` if omitted.

### 3. Verify

```bash
cd backend
python manage.py test

cd ../frontend
npm run build
```

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/users/register/` | Creates a customer and returns the assignment demo code. |
| POST | `/api/users/recognize/` | Reports whether an email is registered; never returns the OTP. |
| POST | `/api/users/verify-otp/` | Validates a code and returns a signed checkout token. |
| POST | `/api/checkout/` | Saves a guest or verified checkout order. |

### Example checkout request

```json
{
  "email": "ada@example.com",
  "phone": "+919876543210",
  "shipping_address": "42 Orchard Road, Bengaluru"
}
```

Supply `Authorization: Bearer <token>` after OTP verification to link this order to the authenticated customer. A guest request omits this header.

## Deployment

Deploy `frontend/` to Vercel (or similar static hosting) and `backend/` to Render/Railway/etc. Use a PostgreSQL database such as Supabase or Neon in production.

Set these backend variables:

```text
SECRET_KEY=<long random secret>
DEBUG=False
DATABASE_URL=postgresql://...
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.example
ALLOWED_HOSTS=your-api-domain.example
```

Set `VITE_API_BASE_URL=https://your-api-domain.example/api` for the frontend build. Run Django migrations during deployment. HTTPS is required in production.

## Security notes

- OTPs are produced with Python's `secrets` module and stored using Django's password hash.
- Recognition deliberately excludes OTP values.
- OTP attempts are throttled and failed verification returns no account-specific detail.
- Checkout tokens are signed and expire after two hours.
- All request data is validated on the server and database work goes through Django ORM.
- This demo uses an OTP displayed to the registrant because the assignment mandates it. A production application should deliver codes over a verified channel and add stronger rate limiting/audit controls.
