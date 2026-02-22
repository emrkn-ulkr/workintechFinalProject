import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const baseSlides = [
  {
    id: 1,
    to: '/shop',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 2,
    to: '/shop',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 3,
    to: '/shop',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80',
  },
];

function HeroSlider() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const localizedSlides = useMemo(() => {
    const translatedSlides = t('hero.slides');

    return baseSlides.map((slide, index) => ({
      ...slide,
      ...(Array.isArray(translatedSlides) ? translatedSlides[index] : {}),
    }));
  }, [t]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % localizedSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [localizedSlides.length]);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % localizedSlides.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + localizedSlides.length) % localizedSlides.length);

  return (
    <section className="relative overflow-hidden rounded-2xl shadow-card">
      {localizedSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
        </div>
      ))}

      <div className="relative z-10 flex min-h-[340px] flex-col justify-end bg-gradient-to-r from-slate-900/70 via-slate-900/30 to-transparent p-6 text-white sm:min-h-[420px] sm:p-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">{t('hero.brand')}</p>
        <h1 className="max-w-xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
          {localizedSlides[activeIndex]?.title}
        </h1>
        <p className="mt-3 max-w-lg text-sm text-slate-100 sm:text-base">{localizedSlides[activeIndex]?.subtitle}</p>
        <Link
          to={localizedSlides[activeIndex]?.to || '/shop'}
          className="mt-6 inline-flex w-fit items-center rounded-md bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          {localizedSlides[activeIndex]?.cta}
        </Link>
      </div>

      <button
        type="button"
        aria-label={t('hero.prevSlide')}
        onClick={prevSlide}
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 p-2 text-slate-900 transition hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label={t('hero.nextSlide')}
        onClick={nextSlide}
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 p-2 text-slate-900 transition hover:bg-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {localizedSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            aria-label={t('hero.gotoSlide', { index: index + 1 })}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition ${
              index === activeIndex ? 'w-7 bg-white' : 'w-2.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroSlider;
