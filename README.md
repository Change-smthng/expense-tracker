# SplitEase – Personal Expense Tracker

SplitEase is a minimal full-stack expense tracker built for the assignment brief.

- **Frontend:** Next.js 16 (App Router), React 19, Clerk authentication, Tailwind CSS 4
- **Backend:** FastAPI + SQLAlchemy
- **Database:** SQLite by default (with optional PostgreSQL via `DATABASE_URL`)

The app focuses on safe expense creation under real-world conditions (retries, duplicate submits, refreshes), with idempotent backend writes.

---

## 1) What is implemented

### Backend
- `POST /api/expenses`
	- Creates a new expense with `amount`, `category`, `description`, `date`, and `idempotency_key`
	- Requires `Authorization` header (used as user identity)
	- Enforces idempotency per user using `idempotency_key` to prevent duplicates
- `GET /api/expenses`
	- Lists expenses for the authenticated user
	- Supports optional:
		- `category` filter
		- `sort=date_desc` (default) or `sort=date_asc`
- Data model includes:
	- `id`, `user_id`, `idempotency_key`, `amount`, `category`, `description`, `date`, `created_at`

### Frontend
- Clerk-based sign-in / sign-up flows
- Protected routes with Clerk middleware
- “Add Expense” form with basic validation:
	- amount must be positive
	- category/description/date required
- Client sends a generated `idempotency_key` (`crypto.randomUUID()`) for robust retries

---

## 2) Project structure

```text
auth/
├── app/                  # Next.js frontend
├── backend/              # FastAPI backend
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── routers/
│       └── expenses.py
├── middleware.ts         # Clerk route protection
└── README.md
```

---

## 3) Local setup

## Prerequisites
- Node.js 20+
- Python 3.10+
- npm

### A) Backend setup (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

By default, if `DATABASE_URL` is not set, the app uses local SQLite:

- `backend/splitwise.db`

Start backend:

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend docs will be available at:

- `http://localhost:8000/docs`

### B) Frontend setup (Next.js)

```bash
cd ..
npm install
```

Create `.env.local` in project root:

```dotenv
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

Start frontend:

```bash
npm run dev
```

Frontend runs at:

- `http://localhost:3000`

---

## 4) API usage

Base URL: `http://localhost:8000`

### Create expense

`POST /api/expenses`

Headers:
- `Authorization: Bearer <clerk_user_id>`
- `Content-Type: application/json`

Body:

```json
{
	"idempotency_key": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
	"amount": 250.75,
	"category": "Food",
	"description": "Dinner",
	"date": "2026-05-01"
}
```

Example:

```bash
curl -X POST http://localhost:8000/api/expenses \
	-H "Authorization: Bearer user_123" \
	-H "Content-Type: application/json" \
	-d '{
		"idempotency_key": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
		"amount": 250.75,
		"category": "Food",
		"description": "Dinner",
		"date": "2026-05-01"
	}'
```

### List expenses

`GET /api/expenses?category=Food&sort=date_desc`

Headers:
- `Authorization: Bearer <clerk_user_id>`

Example:

```bash
curl "http://localhost:8000/api/expenses?category=Food&sort=date_desc" \
	-H "Authorization: Bearer user_123"
```

---

## 5) Design decisions

- **Idempotency for correctness:**
	- Duplicate submits/retries are handled via client-generated `idempotency_key`
	- Backend returns existing record for repeated key + same user
- **Money type in storage:**
	- Database uses `NUMERIC(10,2)` for precision
	- Current API schema exposes amount as `float` (trade-off: simple, but decimal-safe serialization could be improved)
- **Simple auth boundary:**
	- Clerk protects frontend routes
	- Backend scopes data by `Authorization` header user ID
- **Persistence choice:**
	- SQLite default for low-friction local development
	- PostgreSQL supported by setting `DATABASE_URL`

---

## 6) Assignment coverage status

### Implemented
- Create expense API
- List expenses API
- Category filtering
- Date sorting (`date_desc`, `date_asc`)
- Idempotent expense creation on retries

### Partial / pending in current frontend
- Expense list/table view wired to backend
- Visible total of currently filtered list
- Filter/sort controls in the UI

The backend primitives are in place for these UI features; frontend wiring is the next step.

---

## 7) Trade-offs and intentionally not done

- Prioritized backend data correctness and idempotency over richer frontend list UX
- Kept API small and focused to the assignment core
- Did not add automated tests yet due to timebox
- Kept error/loading states minimal in UI

---

## 8) Notes

- The `AddExpenseForm` currently appends `?clerk_id=...` in the request URL, but backend authorization uses the `Authorization` header. The query parameter is redundant and can be removed safely.
- If running production-like setups, lock CORS origins instead of `allow_origins=["*"]`.
