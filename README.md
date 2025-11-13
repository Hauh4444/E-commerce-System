# Ecommerce System

A full-stack reference implementation for a minimal e-commerce platform built with a Flask REST API and a React + Vite single-page frontend. The repository is organised as a multi-project workspace so that each service can be developed and deployed independently while sharing a common product definition.

> Status: Ongoing

## Project Overview
- Token-based authentication with registration and login flows.
- Product catalogue management with search, CRUD endpoints, and optimistic pricing data.
- Cart, order, and user resources backed by MongoDB document collections.
- Modern React storefront with routing, context-based state management, and reusable UI components.
- TypeScript, ESLint, and TailwindCSS for consistent frontend developer experience.

## Tech Stack
- **Backend:** Python 3, Flask 3, PyMongo, JWT, CORS.
- **Frontend:** React 19, Vite 7, TypeScript 5, TailwindCSS, Radix UI primitives.
- **Data:** MongoDB (local or managed cluster).
- **Tooling:** npm, pip, virtualenv, ESLint, TypeScript compiler.

## Repository Layout
- `flask-backend/` – Flask API service, MongoDB integration, JWT helpers, and route blueprints.
- `react-frontend/` – Vite + React SPA that consumes the backend API.
- `README.md` – Monorepo quick start and shared documentation (this file).

## Quick Start
1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-org>/Ecommerce-System.git
   cd Ecommerce-System
   ```

2. **Provision dependencies**
   - Install Python 3.11+ and `pip`.
   - Install Node.js 20+ (or the version required by your team) and npm.
   - Have a MongoDB instance available locally (default `mongodb://localhost:27017`) or via a managed service.

3. **Start the backend**
   ```bash
   cd flask-backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   export MONGO_URI="mongodb://localhost:27017"
   export MONGO_DB="ecommerce"
   export JWT_SECRET_KEY="local-dev-secret"
   flask --app app run --debug
   ```
   The API runs on `http://127.0.0.1:5000` by default. See `flask-backend/README.md` for the full list of configuration flags and endpoints.

4. **Start the frontend**
   ```bash
   cd ../react-frontend
   npm install
   echo "VITE_API_BASE_URL=http://127.0.0.1:5000" > .env.local
   npm run dev
   ```
   Vite serves the storefront at `http://127.0.0.1:5173`. The `.env.local` file overrides the API base URL without committing secrets.

## Environment Configuration

Backend (`flask-backend/.env` or shell exports):
- `MONGO_URI` – MongoDB connection string (default `mongodb://localhost:27017`).
- `MONGO_DB` – Database name to use (default `ecommerce`).
- `JWT_SECRET_KEY` – Secret key for signing JWT access tokens.
- `JWT_ALGORITHM` – Signing algorithm (`HS256` by default).
- `JWT_ACCESS_EXPIRES_MINUTES` – Token lifetime in minutes (defaults to 60).
- `FLASK_DEBUG`, `FLASK_TESTING`, `FLASK_SECRET_KEY` – Standard Flask flags.

Frontend (`react-frontend/.env` or `.env.local`):
- `VITE_API_BASE_URL` – Root URL of the Flask API (defaults to `http://127.0.0.1:5000`).

## Development Workflow
- Run `npm run lint` inside `react-frontend` for TypeScript/ESLint checks.
- Use `npm run build` to produce a production-ready frontend bundle.
- Run `pip install -r requirements.txt` after backend dependency updates.
- MongoDB data is persisted between runs; drop the `ecommerce` database to reset sample data.

## Documentation
- Backend API details, endpoint descriptions, and request/response examples are documented in `flask-backend/README.md`.
- Frontend conventions, project scripts, and architectural notes live in `react-frontend/README.md`.

Feel free to tailor the stack, copy, or component structure to match your organisation’s needs. Contributions via issues and pull requests are welcome.
