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

## Quality Checks

```bash
npm run lint
npm run build
```

## API

- Base URL: `https://workintech-fe-ecommerce.onrender.com`
- Auth header format: `Authorization: <token>` (without `Bearer`)

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

## Demo Login Users

- `customer@commerce.com` / `123456`
- `store@commerce.com` / `123456`
- `admin@commerce.com` / `123456`
