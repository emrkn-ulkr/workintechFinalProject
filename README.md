# Workintech Final Project

E-commerce frontend project built with the teacher requirement stack and Figma-based layout approach.

## Stack

- React + Vite
- React Router v5
- Redux (vanilla) + Redux Thunk + Redux Logger
- Tailwind CSS (utility-first, mobile-first)
- Axios
- React Hook Form
- React Toastify
- Lucide React

## Run

```bash
npm install
npm run dev
```

## Environment

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Available variables:

- `VITE_API_BASE_URL` (default: `https://workintech-fe-ecommerce.onrender.com`)

## Deployment

- Vercel / Render / Netlify deployment is supported for static build output.
- Build command: `npm run build`
- Publish directory: `dist`
- Add your live URL here after deployment: `YOUR_LIVE_URL`

## Quality Checks

```bash
npm run lint
npm run build
npm run security:audit
npm run check:release
```

## API

- Base URL: `https://workintech-fe-ecommerce.onrender.com`
- Auth header format: `Authorization: <token>` (without `Bearer`)

## Postman

- Collection file: `postman/WorkintechFinalProject.postman_collection.json`
- Import the collection and set `token` variable after login.

## Implemented Structure

```text
src/
  actions/
  api/
  components/
  layout/
  pages/
  reducers/
  store/
  thunks/
  utils/
```

## Current Coverage

- Project setup and dependencies (T01)
- Shared layout with single Header/Footer and router shell
- Home / Shop / Product Detail / Contact / Team / About pages (responsive)
- Signup form with role-based store fields and API integration
- Login form with remember-me + auto token verify
- Categories + products fetch, filter, sort, pagination(load more)
- Product detail fetch and add-to-cart flow
- Shopping cart page and order summary box
- Protected route scaffolding for checkout and previous orders

## Demo Login Users (Demo Backend Only)

- `customer@commerce.com` / `123456`
- `store@commerce.com` / `123456`
- `admin@commerce.com` / `123456`

Use these only for demo API/testing. Do not use in production.

## Public Release Checklist

- Keep `.env` files private (never commit `.env` / secret keys).
- Run `npm run check:release` before each deploy.
- Ensure hosting uses HTTPS and security headers (Netlify/Vercel configs included).
- Verify your production API URL is set with `VITE_API_BASE_URL`.
