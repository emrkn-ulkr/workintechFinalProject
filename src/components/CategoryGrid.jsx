import { Link } from 'react-router-dom';
import { buildCategoryPath } from '../utils/categoryPaths';

function CategoryGrid({ categories = [] }) {
  return (
    <div className="flex flex-wrap gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={buildCategoryPath(category)}
          className="group relative w-full overflow-hidden rounded-2xl bg-slate-900 shadow-card sm:w-[calc(50%-0.5rem)] lg:w-[calc(20%-0.8rem)]"
        >
          <img
            src={category.img}
            alt={category.title}
            className="h-40 w-full object-cover opacity-80 transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
              Rating {category.rating.toFixed(1)}
            </p>
            <h3 className="font-display text-lg font-semibold text-white">{category.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default CategoryGrid;
