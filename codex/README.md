# ◈ Orbit Backend API & Mission Control

Production-grade, modular **Python / FastAPI** backend for [Orbit — The Agent-First Workspace](https://website-codex-red.vercel.app/).

---

## ⚡ Key Capabilities

1. **Early Access Waitlist System**: Email validation, builder role segmentation (`frontend`, `fullstack`, `teams`), duplicate prevention, queue numbering, and confirmation notifications.
2. **Contact & Team Demo Inquiries**: Lead collection, inquiry triage (`new`, `in_review`, `contacted`, `closed`), and notifications.
3. **Newsletter Subscription**: Instant newsletter subscription and unsubscribe management.
4. **AI Agent Planning & Orchestration**:
   - **Interactive Landing Demo (`POST /api/v1/agents/demo`)**: Simulates and returns real-time multi-step agent plans, files affected, and diff previews for visitors in the Orbit hero window.
   - **Persistent Agent Tasks (`/api/v1/agents/tasks`)**: Task tracking with multi-phase execution (Plan -> Build -> Verify), step progression, artifact diffs, and execution logs.
5. **User Authentication (JWT & OAuth2)**: Secure password hashing (`bcrypt`), JWT access tokens, refresh tokens, and Swagger UI authorization.
6. **Individual Profiles & Project Workspaces**: User profiles with builder preferences and multi-project workspaces with branch tracking.
7. **PostgreSQL / Supabase Integration**: Built on SQLAlchemy 2.0 with connection pooling and automated schema migration. Includes zero-setup SQLite fallback for instant local testing.
8. **Interactive Mission Control Admin Dashboard (`/admin`)**: Built-in web dashboard to view live stats, review waitlist signups, approve candidates, export CSVs, triage inquiries, and test agent plans.

---

## 🏗️ Architecture & Directory Structure

```
orbit-backend/
├── app/
│   ├── main.py                  # FastAPI app entry point, lifecycle, CORS, static mounts
│   ├── core/
│   │   ├── config.py            # Pydantic v2 settings, Supabase URL parser, CORS
│   │   ├── database.py          # SQLAlchemy engine, session generator (get_db)
│   │   ├── security.py          # Passlib bcrypt hashing, JWT encode/decode
│   │   └── deps.py              # Auth dependencies: get_current_user, get_current_admin
│   ├── models/                  # SQLAlchemy ORM models
│   │   ├── user.py              # User account & role
│   │   ├── profile.py           # Builder profile & preferences
│   │   ├── project.py           # Project workspace & git branch
│   │   ├── agent.py             # AgentTask, execution plan, logs & diffs
│   │   ├── waitlist.py          # Early access waitlist entry
│   │   ├── inquiry.py           # Demo / sales / partner inquiries
│   │   └── newsletter.py        # Newsletter subscribers
│   ├── schemas/                 # Pydantic validation schemas
│   │   ├── auth.py              # Login, Register, Tokens
│   │   ├── user.py              # User & Profile read/update
│   │   ├── project.py           # Project CRUD schemas
│   │   ├── agent.py             # Agent steps, demo preview, tasks
│   │   ├── waitlist.py          # Waitlist join & status
│   │   ├── inquiry.py           # Inquiry submit & update
│   │   ├── newsletter.py        # Newsletter subscribe
│   │   └── admin.py             # Dashboard statistics
│   ├── services/                # Business logic & integrations
│   │   ├── auth_service.py      # Registration, auth, default admin seeder
│   │   ├── agent_service.py     # Orbit 3-step agent planner & demo engine
│   │   └── email_service.py     # Email notifications & alerts
│   ├── api/                     # REST API routers
│   │   ├── api.py               # Combined v1 router
│   │   └── v1/
│   │       ├── auth.py          # /api/v1/auth
│   │       ├── users.py         # /api/v1/users
│   │       ├── projects.py      # /api/v1/projects
│   │       ├── agents.py        # /api/v1/agents
│   │       ├── waitlist.py      # /api/v1/waitlist
│   │       ├── inquiries.py     # /api/v1/inquiries
│   │       ├── newsletter.py    # /api/v1/newsletter
│   │       └── admin.py         # /api/v1/admin
│   └── static/
│       └── admin/               # Embedded Mission Control Admin Dashboard
│           ├── index.html
│           ├── admin.css
│           └── admin.js
├── frontend/                    # Orbit Landing Page (downloaded & enhanced)
│   ├── index.html               # Updated with Waitlist Modal, Demo Dialog & Runner
│   ├── styles.css               # Orbit styling + modal & runner CSS
│   ├── script.js                # Interactive event bindings
│   └── orbit-api.js             # Orbit Frontend SDK
├── tests/                       # Pytest test suite
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_waitlist.py
│   └── test_agents.py
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── vercel.json
└── README.md
```

---

## 📡 API Reference Summary (`/api/v1`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/waitlist/` | Submit email & builder role for early access | Public |
| `GET` | `/api/v1/waitlist/status` | Check queue position by email | Public |
| `POST` | `/api/v1/inquiries/` | Submit demo or sales contact request | Public |
| `POST` | `/api/v1/newsletter/subscribe` | Subscribe to release updates | Public |
| `POST` | `/api/v1/agents/demo` | Interactive agent simulator for landing hero | Public |
| `POST` | `/api/v1/auth/register` | Register new user account | Public |
| `POST` | `/api/v1/auth/login` | Authenticate with email & password (JWT) | Public |
| `POST` | `/api/v1/auth/refresh` | Refresh access token | Public |
| `GET` | `/api/v1/auth/me` | Current user profile | Bearer Token |
| `GET/POST`| `/api/v1/projects/` | List and create project workspaces | Bearer Token |
| `GET/POST`| `/api/v1/agents/tasks` | Create and track AI agent tasks | Bearer Token |
| `POST` | `/api/v1/agents/tasks/{id}/step` | Execute next planned agent step | Bearer Token |
| `GET` | `/api/v1/admin/stats` | Real-time system metrics | Admin Token |
| `GET` | `/api/v1/admin/waitlist` | List and filter waitlist candidates | Admin Token |
| `PATCH`| `/api/v1/admin/waitlist/{id}/status`| Approve or invite waitlist user | Admin Token |
| `GET` | `/api/v1/admin/waitlist/export-csv` | Download complete waitlist as CSV | Admin Token |
| `GET` | `/api/v1/admin/inquiries` | Review submitted team inquiries | Admin Token |

Interactive Swagger documentation is available at **`/docs`** and ReDoc at **`/redoc`**.

---

## 🚀 Quickstart Guide

### 1. Prerequisites
Ensure you have **Python 3.10+** installed. (Or run using Docker).

### 2. Setup Virtual Environment
```bash
# Navigate to the project directory
cd "C:\Users\Krish Jain\.gemini\antigravity\scratch\orbit-backend"

# Create a virtual environment
python -m venv venv

# Activate on Windows
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

### 4. Database Setup (Supabase / PostgreSQL or Local SQLite)
- **Local Testing (Zero Setup)**: The default `.env` uses `DATABASE_URL="sqlite:///./orbit.db"`. The backend creates all tables and seeds the admin user automatically.
- **Supabase / PostgreSQL**:
  1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
  2. Navigate to **Project Settings** → **Database** → **Connection String** (URI).
  3. Set `DATABASE_URL` in `.env`:
     ```env
     DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
     ```

### 5. Run the Server
```bash
uvicorn app.main:app --reload --port 8000
```

- **Landing Page**: [http://localhost:8000/](http://localhost:8000/)
- **Admin Mission Control**: [http://localhost:8000/admin](http://localhost:8000/admin)
- **Swagger Interactive API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🛡️ Default Administrator Account

The server automatically seeds a default administrator on startup:
- **Email**: `admin@orbit.dev`
- **Password**: `OrbitAdminPassword2026!`

*(You can change these credentials anytime in your `.env` file).*

---

## 🧪 Running Automated Tests

```bash
pytest -v
```

All test cases verify authentication, token lifecycles, waitlist registration with duplicate handling, and agent demo simulations against an isolated in-memory test database.

---

## 🚢 Deployment Options

### Deploy with Docker Compose
```bash
docker compose up -d --build
```

### Deploy to Vercel
This repository includes a `vercel.json` pre-configured to deploy both the static frontend and Python FastAPI serverless functions:
```bash
npx vercel
```
