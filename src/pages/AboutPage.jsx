import { useTranslation } from '../hooks/useTranslation';

function AboutPage() {
  const { t } = useTranslation();

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{t('aboutPage.label')}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">{t('aboutPage.title')}</h1>
        <p className="mt-4 text-sm leading-7 text-ink-600">{t('aboutPage.description')}</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <article className="w-full rounded-2xl bg-white p-5 shadow-sm sm:w-[calc(33.333%-0.7rem)]">
          <h2 className="font-display text-lg font-semibold text-ink-900">{t('aboutPage.missionTitle')}</h2>
          <p className="mt-2 text-sm text-ink-600">{t('aboutPage.missionDescription')}</p>
        </article>
        <article className="w-full rounded-2xl bg-white p-5 shadow-sm sm:w-[calc(33.333%-0.7rem)]">
          <h2 className="font-display text-lg font-semibold text-ink-900">{t('aboutPage.visionTitle')}</h2>
          <p className="mt-2 text-sm text-ink-600">{t('aboutPage.visionDescription')}</p>
        </article>
        <article className="w-full rounded-2xl bg-white p-5 shadow-sm sm:w-[calc(33.333%-0.7rem)]">
          <h2 className="font-display text-lg font-semibold text-ink-900">{t('aboutPage.valuesTitle')}</h2>
          <p className="mt-2 text-sm text-ink-600">{t('aboutPage.valuesDescription')}</p>
        </article>
      </div>
    </section>
  );
}

export default AboutPage;
