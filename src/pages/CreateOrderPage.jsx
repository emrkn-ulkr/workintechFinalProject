import { useSelector } from 'react-redux';

function CreateOrderPage() {
  const { address } = useSelector((state) => state.shoppingCart);
  const { payment } = useSelector((state) => state.shoppingCart);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Create Order</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Step 1 & Step 2 Placeholder</h1>
        <p className="mt-3 text-sm text-ink-600">
          Bu alan T20-T22 görevleri için ayrıldı. Address ve payment reducer alanları hazır, endpoint bağlantıları
          sonraki adımda eklenebilir.
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <article className="rounded-2xl bg-white p-5 shadow-sm lg:flex-1">
          <h2 className="font-display text-xl font-semibold text-ink-900">Step 1: Address</h2>
          <pre className="mt-3 overflow-auto rounded-lg bg-slate-100 p-3 text-xs text-ink-700">
            {JSON.stringify(address, null, 2)}
          </pre>
        </article>
        <article className="rounded-2xl bg-white p-5 shadow-sm lg:flex-1">
          <h2 className="font-display text-xl font-semibold text-ink-900">Step 2: Card</h2>
          <pre className="mt-3 overflow-auto rounded-lg bg-slate-100 p-3 text-xs text-ink-700">
            {JSON.stringify(payment, null, 2)}
          </pre>
        </article>
      </div>
    </section>
  );
}

export default CreateOrderPage;
