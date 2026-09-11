# Mentora FastAPI Backend

Modern, high-performance authentication & user infrastructure for **Mentora** built with **FastAPI**, **SQLAlchemy 2.0**, **Pydantic v2**, and **PostgreSQL (Neon-ready)** with full **TypeScript type safety** for the frontend.

---

## Features

- **FastAPI Framework**: High performance, asynchronous architecture with automatic OpenAPI/Swagger documentation.
- **Authentication System**:
  - Email & password registration with native `bcrypt` password hashing.
  - JWT Access Token generation & Bearer token verification.
  - Role-based authorization (`student`, `advisor`, `admin`).
  - Multi-step onboarding state machine and profile updates.
  - 1-Click quick demo login for testing (`student@example.com`, `advisor@example.com`, `admin@example.com`).
  - Email checking and verification flows.
- **Database (Neon PostgreSQL & SQLite)**:
  - Plug-and-play **Neon PostgreSQL** serverless support via SQLAlchemy with connection recycling & pre-ping.
  - Automatic zero-config fallback to local SQLite (`mentora.db`) if no Neon database URL is set.
- **TypeScript Type Safety**:
  - Auto-generated TypeScript definitions located in `frontend/src/types/api.ts` synced from Pydantic schemas.

---

## Getting Started

### 1. Environment Configuration

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

To connect to your **Neon PostgreSQL** database, set your connection string in `.env`:
```env
DATABASE_URL="postgresql://<user>:<password>@<endpoint>.region.aws.neon.tech/neondb?sslmode=require"
```
*(If left unset, it automatically uses the local SQLite file `mentora.db`.)*

### 2. Seed Demo Accounts

Initialize tables and seed default student, advisor, and admin accounts:
```bash
python app/seed.py
```

Default demo accounts:
- **Student**: `student@example.com` / `StudentPass123!`
- **Advisor**: `advisor@example.com` / `AdvisorPass123!`
- **Admin**: `admin@example.com` / `AdminPass123!`

### 3. Start the Server

Run with Uvicorn:
```bash
uvicorn app.main:app --reload --port 8000
```
Or run the PowerShell helper script:
```powershell
.\run.ps1
```

Server will be running at: **`http://localhost:8000`**

### 4. Interactive API Documentation

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

### 5. Running Tests

Execute the automated test suite:
```bash
python tests/test_auth.py
```

### 6. Synchronizing TypeScript Types

Regenerate TypeScript interfaces for the frontend anytime Pydantic schemas change:
```bash
python scripts/generate_ts_types.py
```
This writes directly to [`frontend/src/types/api.ts`](../frontend/src/types/api.ts).
