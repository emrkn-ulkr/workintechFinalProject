function AboutPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">About Us</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Fashion-first commerce experience</h1>
        <p className="mt-4 text-sm leading-7 text-ink-600">
          This project follows the Workintech E-commerce Final requirements with a mobile-first structure, reusable
          components, Redux state management, and React Router v5 route layout.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <article className="w-full rounded-2xl bg-white p-5 shadow-sm sm:w-[calc(33.333%-0.7rem)]">
          <h2 className="font-display text-lg font-semibold text-ink-900">Mission</h2>
          <p className="mt-2 text-sm text-ink-600">Build a scalable and maintainable ecommerce frontend architecture.</p>
        </article>
        <article className="w-full rounded-2xl bg-white p-5 shadow-sm sm:w-[calc(33.333%-0.7rem)]">
          <h2 className="font-display text-lg font-semibold text-ink-900">Vision</h2>
          <p className="mt-2 text-sm text-ink-600">Deliver smooth shopping interactions from mobile to desktop.</p>
        </article>
        <article className="w-full rounded-2xl bg-white p-5 shadow-sm sm:w-[calc(33.333%-0.7rem)]">
          <h2 className="font-display text-lg font-semibold text-ink-900">Values</h2>
          <p className="mt-2 text-sm text-ink-600">Consistency, simplicity, and API-driven implementation.</p>
        </article>
      </div>
    </section>
  );
}

export default AboutPage;
