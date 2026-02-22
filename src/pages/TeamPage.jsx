import { useMemo } from 'react';
import { useTranslation } from '../hooks/useTranslation';

function TeamPage() {
  const { t } = useTranslation();

  const teamMembers = useMemo(
    () => [
      {
        id: 1,
        name: 'G\u00f6khan \u00d6zdemir',
        role: t('teamPage.roleProjectManager'),
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 2,
        name: 'Emre Ulkur',
        role: t('teamPage.roleFullStackDeveloper'),
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 3,
        name: t('teamPage.memberOne'),
        role: t('teamPage.roleFrontendDeveloper'),
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 4,
        name: t('teamPage.memberTwo'),
        role: t('teamPage.roleBackendDeveloper'),
        image: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=400&q=80',
      },
    ],
    [t],
  );

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{t('teamPage.label')}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">{t('teamPage.title')}</h1>
        <p className="mt-3 text-sm text-ink-600">{t('teamPage.description')}</p>
      </div>

      <div className="flex flex-wrap gap-4">
        {teamMembers.map((member) => (
          <article
            key={member.id}
            className="w-full rounded-2xl bg-white p-4 shadow-sm sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
          >
            <img src={member.image} alt={member.name} className="h-52 w-full rounded-xl object-cover" />
            <h2 className="mt-4 font-display text-lg font-semibold text-ink-900">{member.name}</h2>
            <p className="text-sm text-brand-600">{member.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default TeamPage;
