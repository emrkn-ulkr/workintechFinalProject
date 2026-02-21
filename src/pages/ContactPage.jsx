import { Mail, MapPin, Phone } from 'lucide-react';

function ContactPage() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <section className="rounded-2xl bg-white p-6 shadow-sm lg:w-[56%]">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Contact</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Let&apos;s talk about your order</h1>
        <p className="mt-4 text-sm text-ink-600">
          Bu sayfa T05 için mobile-first responsive şekilde hazırlandı. Form ve iletişim blokları tek header/footer ile
          çalışır.
        </p>

        <form className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <textarea
            rows={5}
            placeholder="Message"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="button"
            className="rounded-md bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Send Message
          </button>
        </form>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm lg:w-[44%]">
        <h2 className="font-display text-xl font-semibold text-ink-900">Contact Information</h2>
        <div className="mt-5 space-y-4 text-sm text-ink-700">
          <div className="flex items-center gap-3 rounded-xl bg-slate-100 p-3">
            <MapPin className="h-5 w-5 text-brand-600" />
            <span>Istanbul, Turkey</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-slate-100 p-3">
            <Mail className="h-5 w-5 text-brand-600" />
            <span>support@wtstore.dev</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-slate-100 p-3">
            <Phone className="h-5 w-5 text-brand-600" />
            <span>+90 555 123 45 67</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
