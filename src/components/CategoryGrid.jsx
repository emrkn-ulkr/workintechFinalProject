import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { buildCategoryPath } from '../utils/categoryPaths';
import { getLocalizedCategoryTitle } from '../utils/categoryUtils';

function CategoryGrid({ categories = [] }) {
  const { t, language } = useTranslation();

  return (
    <div className="flex flex-wrap gap-4">
      {categories.map((category) => {
        const rating = Number.isFinite(Number(category.rating)) ? Number(category.rating) : 0;
        const categoryTitle = getLocalizedCategoryTitle(category.title, language);

        return (
          <Link
            key={category.id}
            to={buildCategoryPath(category)}
            className="group relative w-full overflow-hidden rounded-2xl bg-slate-900 shadow-card sm:w-[calc(50%-0.5rem)] lg:w-[calc(20%-0.8rem)]"
          >
            <img
              src={category.img}
              alt={categoryTitle}
              className="h-40 w-full object-cover opacity-80 transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                {t('common.rating')} {rating.toFixed(1)}
              </p>
              <h3 className="font-display text-lg font-semibold text-white">{categoryTitle}</h3>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default CategoryGrid;
