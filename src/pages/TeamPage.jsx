const teamMembers = [
  {
    id: 1,
    name: 'Gökhan Özdemir',
    role: 'Project Manager',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    name: 'Emre Ulkur',
    role: 'Full Stack Developer',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    name: 'Team Member 1',
    role: 'Frontend Developer',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    name: 'Team Member 2',
    role: 'Backend Developer',
    image: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=400&q=80',
  },
];

function TeamPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Team</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Meet the project team</h1>
        <p className="mt-3 text-sm text-ink-600">
          T06 gereksinimine göre tek header/footer düzeninde ekip bilgileri burada listeleniyor.
        </p>
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
