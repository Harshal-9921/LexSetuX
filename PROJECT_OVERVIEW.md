# Project Overview
for backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001


This Markdown gives a guided tour of the full repository so you can quickly find backend, frontend, data, and documentation artifacts.

## High-Level Layout
- Backend API (FastAPI): [backend/app](backend/app)
- Datasets for AI/legal references: [dataset](dataset)
- Frontend (Vite + React + Tailwind): [frontend/src](frontend/src)
- Utility scripts (scraping, seeding, indexing): [backend/scripts](backend/scripts)
- Documentation bundle: [Documents](Documents) and additional backend guides in [backend](backend)
- UI/UX notes: [UI_LAYOUT_CHANGES.md](UI_LAYOUT_CHANGES.md)

## Backend (FastAPI)
**Entry point & app wiring**
- [backend/app/main.py](backend/app/main.py): creates FastAPI app, CORS, mounts routers (`/api/auth`, `/api/cases`, `/api/lawyers`, `/api/bookings`, `/api/contact`), and auto-creates tables at startup.
- [backend/app/config.py](backend/app/config.py): environment-backed settings (DB URL, JWT, AI model selection `AI_MODEL`, SMTP, CORS, Supabase placeholders).
- [backend/app/database.py](backend/app/database.py): async SQLAlchemy engine/session, models (`User`, `Case`, `Lawyer`, `CaseLawyerMatch`, `Booking`) and `get_db` dependency.

**Auth & users**
- [backend/app/utils/auth.py](backend/app/utils/auth.py): password hashing (bcrypt), JWT creation/verification, user lookup/authentication helpers.
- [backend/app/routers/auth.py](backend/app/routers/auth.py): register, login (form and JSON), current user endpoints; token-based dependencies (`get_current_user`, `get_current_user_required`).

**Case analysis & AI**
- [backend/app/routers/case_analysis.py](backend/app/routers/case_analysis.py): POST `/api/cases/analyze` uses selected AI service (rule-based or LegalBERT via factory) with role-aware outputs; stores cases when authenticated; GET `/api/cases/my-cases` and `/api/cases/{id}`.
- [backend/app/services/ai_service_factory.py](backend/app/services/ai_service_factory.py): chooses AI backend based on `AI_MODEL` (`rule_based` or `bert`, with fallback).
- [backend/app/services/ai_service.py](backend/app/services/ai_service.py): lightweight rule-based analyzer; keyword/category detection, customer vs lawyer result shapes (simplified rights/sections vs technical sections, precedents, opponent points, strength score, summaries).
- [backend/app/services/ai_service_bert.py](backend/app/services/ai_service_bert.py): transformer-based LegalBERT analysis (zero-shot classification, entity extraction, role-based outputs); requires `transformers`/`torch`.
- [backend/app/services/dataset_loader.py](backend/app/services/dataset_loader.py): loads JSON datasets (cases, IPC sections, constitutional rights, sample lawyers) from [dataset](dataset).

**Lawyers & matching**
- [backend/app/services/lawyer_service.py](backend/app/services/lawyer_service.py): scores available lawyers by specialization, location, experience, rating; returns match reasons.
- [backend/app/routers/lawyers.py](backend/app/routers/lawyers.py): create/update lawyer profile (role-gated), list with filters, match endpoint, fetch by id, fetch current lawyer profile.

**Bookings & contact**
- [backend/app/routers/bookings.py](backend/app/routers/bookings.py): create booking (customer for a case → lawyer), list own bookings (role-aware), get/update/delete with role-based guards; uses `Booking` model.
- [backend/app/routers/contact.py](backend/app/routers/contact.py): sends contact form emails via SMTP settings (admin + customer auto-reply).

**Schemas**
- [backend/app/models/schemas.py](backend/app/models/schemas.py): Pydantic models for users, tokens, cases, lawyer profiles/matches, bookings, and role-specific case analysis responses.

**Run & setup**
- Quick start: [backend/README.md](backend/README.md) (install deps, env, run `uvicorn app.main:app --reload`, Swagger at `/docs`).
- DB config via `.env` (`DATABASE_URL` supports SQLite dev default and PostgreSQL production). Use Alembic for migrations (not included).

## Frontend (Vite + React + Tailwind)
**App shell & routing**
- [frontend/src/main.tsx](frontend/src/main.tsx): mounts React app.
- [frontend/src/App.tsx](frontend/src/App.tsx): providers (React Query, Auth, tooltips, toasters), routes: `/` (Index), `/auth`, `/about`, `/contact`, `/client-dashboard`, `/lawyer-dashboard`, fallback `*`.

**Key feature components**
- [frontend/src/components/CaseInputForm.tsx](frontend/src/components/CaseInputForm.tsx): case description form with prompts, optional file placeholders, calls FastAPI `analyzeCase`, stores results in localStorage, renders `CaseAnalysisResults`.
- [frontend/src/components/CaseAnalysisResults.tsx](frontend/src/components/CaseAnalysisResults.tsx): role-based render of analysis output; customers get rights, sections, recommendations, matched lawyers + booking flow; lawyers get technical sections, precedents, opponent points, strength, summary.
- [frontend/src/components/BookingsPanel.tsx](frontend/src/components/BookingsPanel.tsx): lists and manages bookings (filter by status, role-aware actions for lawyers/customers).
- Marketing/landing sections: [HeroSection.tsx](frontend/src/components/HeroSection.tsx), [ServicesSection.tsx](frontend/src/components/ServicesSection.tsx), [ModelTrainingSection.tsx](frontend/src/components/ModelTrainingSection.tsx), [Navigation.tsx](frontend/src/components/Navigation.tsx).

**State & services**
- Auth context: [frontend/src/hooks/useAuth](frontend/src/hooks/useAuth) (session/profile, sign in/out flows).
- API client: [frontend/src/services](frontend/src/services) (calls FastAPI for analysis, bookings, etc.).

**Styling & build**
- Tailwind configuration: [frontend/tailwind.config.ts](frontend/tailwind.config.ts), global styles in [frontend/src/index.css](frontend/src/index.css) and [frontend/src/App.css](frontend/src/App.css).
- Vite setup: [frontend/vite.config.ts](frontend/vite.config.ts); package scripts in [frontend/package.json](frontend/package.json).

## Data & ML Assets
- [dataset/cases_database.json](dataset/cases_database.json): sample past cases for reference matching.
- [dataset/ipc_sections.json](dataset/ipc_sections.json): IPC/act sections metadata.
- [dataset/constitutional_rights.json](dataset/constitutional_rights.json): rights catalog.
- [dataset/lawyers_sample.json](dataset/lawyers_sample.json): sample lawyers for matching/demo.
- Loader consumes these via [backend/app/services/dataset_loader.py](backend/app/services/dataset_loader.py).

## Scripts & Utilities
- [backend/scripts/create_faiss_index.py](backend/scripts/create_faiss_index.py): build FAISS index (vector search) from datasets.
- [backend/scripts/scrape_from_website.py](backend/scripts/scrape_from_website.py), [backend/scripts/scrape_legal_data.py](backend/scripts/scrape_legal_data.py): data collection helpers.
- [backend/scripts/seed_database.py](backend/scripts/seed_database.py): seed DB with initial data.
- [backend/check_db.py](backend/check_db.py): DB connectivity check.

## Documentation Bundle
Key guides live in [Documents](Documents): setup, quick starts, deployment status, architecture, UI fixes, booking system docs, troubleshooting, and LegalBERT notes. Notable starting points:
- [Documents/START_HERE.md](Documents/START_HERE.md)
- [Documents/PROJECT_DOCUMENTATION.md](Documents/PROJECT_DOCUMENTATION.md)
- [Documents/SYSTEM_ARCHITECTURE.md](Documents/SYSTEM_ARCHITECTURE.md)

Backend-specific notes also in: [backend/SETUP.md](backend/SETUP.md), [backend/DATA_SCRAPING_GUIDE.md](backend/DATA_SCRAPING_GUIDE.md), [backend/LEGALBERT_SETUP.md](backend/LEGALBERT_SETUP.md), [backend/ROLE_BASED_OUTPUTS.md](backend/ROLE_BASED_OUTPUTS.md).

## How Things Work Together
1. User enters a case in the frontend (`CaseInputForm`) → calls FastAPI `/api/cases/analyze` via `apiClient`.
2. FastAPI selects AI engine (rule-based or LegalBERT) → analyzes description → returns role-specific payload (customer vs lawyer fields).
3. If authenticated, the case is saved; matched lawyers are fetched via `lawyer_service` and returned for customers.
4. Customer can book a recommended lawyer → frontend calls `/api/bookings` to create; lawyers manage requests in the Bookings panel.
5. Contact page posts to `/api/contact/send`, which uses SMTP settings for admin + user notifications.

## Quick Run Reminders
- Backend: `cd backend && uvicorn app.main:app --reload` (configure `.env` for DB/JWT/SMTP; SQLite default works out-of-box).
- Frontend: `cd frontend && npm install && npm run dev` (set `VITE_API_BASE_URL` if backend not on default `http://localhost:8000`).

## Notes & Caveats
- Table creation on startup is for dev; use migrations for production.
- LegalBERT path requires GPU/transformers/torch; otherwise factory falls back to rule-based.
- File upload is stubbed in UI; add FastAPI upload endpoint and wire `uploadFiles` in `CaseInputForm` when ready.
- CORS currently allows `*` for dev—tighten for production.
