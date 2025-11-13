# React Frontend

This package contains the single-page React application for the Ecommerce System. It consumes the Flask API, renders the storefront experience, and manages client-side authentication, cart state, and product discovery.

## Features
- React 19 + TypeScript with Vite HMR and modern bundling.
- TailwindCSS design tokens and Radix UI primitives for accessible components.
- Context-based auth, cart, and toast state providers.
- API utilities for products and auth that wrap `fetch` with typed responses.
- Route-based page structure (`/`, `/products/:id`, `/cart`, `/auth`, `/search`, `/404`).

## Prerequisites
- Node.js 20+ (LTS recommended) and npm.
- Running instance of the backend API (default `http://127.0.0.1:5000`; see `flask-backend/README.md`).

## Installation
```bash
cd react-frontend
npm install
```

## Environment Variables
Create a `.env.local` file to override defaults without committing secrets:
```
VITE_API_BASE_URL=http://127.0.0.1:5000
```

If omitted, the app falls back to `http://127.0.0.1:5000`.

## Available Scripts
- `npm run dev` – Start Vite in development mode on `http://127.0.0.1:5173`.
- `npm run build` – Type-check and create a production build in `dist/`.
- `npm run preview` – Preview the production build locally.
- `npm run lint` – Run ESLint across the project sources.

## Project Structure
```
src/
  api/               // REST helpers for auth and products
  components/        // UI primitives and composite components
  contexts/          // Auth, cart, and toast providers
  pages/             // Route-level views (Home, Product, Cart, etc.)
  routes/            // Route guards
  config.ts          // API configuration helper
  main.tsx           // Application entry point
```

## Development Workflow
1. Ensure the backend API is running and reachable at the URL defined in `VITE_API_BASE_URL`.
2. Run `npm run dev` to start the frontend development server.
3. Visit `http://127.0.0.1:5173` and interact with the storefront.
4. Use the browser devtools network tab to monitor calls to `/auth`, `/products`, `/cart`, and `/orders` endpoints.

## Production Build
```bash
npm run build
npm run preview   # optional sanity check
```
Deploy the contents of `dist/` behind a static file server (e.g., Nginx, Vercel, Netlify). Ensure the backend API is accessible from the deployed origin and update `VITE_API_BASE_URL` accordingly.

## Testing & Quality
- Run `npm run lint` during CI to enforce lint rules and type checking.
- Extend with Jest/Vitest and React Testing Library for component tests as the project grows.

## Additional Documentation
- Overall architecture and quick start lives in the repository root `README.md`.
- Backend API usage, endpoints, and configuration are described in `flask-backend/README.md`.
