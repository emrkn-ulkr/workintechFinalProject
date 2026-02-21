import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Page not found</h1>
      <p className="mt-3 text-sm text-ink-600">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="mt-5 inline-flex rounded-md bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
      >
        Back to home
      </Link>
    </section>
  );
}

export default NotFoundPage;
