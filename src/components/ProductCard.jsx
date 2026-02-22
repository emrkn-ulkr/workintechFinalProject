import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { buildProductPath } from '../utils/categoryPaths';

function ProductCard({ product, categories, onAddToCart }) {
  const { t } = useTranslation();
  const noImageLabel = encodeURIComponent(t('productCard.noImage'));
  const coverImage = product.images?.[0]?.url || `https://via.placeholder.com/640x640?text=${noImageLabel}`;
  const productPath = buildProductPath(product, categories);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-card">
      <Link to={productPath} className="block cursor-pointer">
        <img src={coverImage} alt={product.name} className="h-56 w-full rounded-t-2xl object-cover" />
        <div className="space-y-2 p-4">
          <h3 className="min-h-[3rem] overflow-hidden text-sm font-semibold text-ink-900">{product.name}</h3>
          <p className="max-h-10 overflow-hidden text-xs text-ink-500">{product.description}</p>
          <div className="flex items-center justify-between pt-2">
            <p className="text-base font-bold text-brand-700">
              {Number(product.price || 0).toFixed(2)} {t('common.tl')}
            </p>
            <p className="text-xs font-medium text-ink-500">{t('productCard.rating', { value: Number(product.rating || 0).toFixed(2) })}</p>
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => onAddToCart(product)}
        className="m-4 mt-0 inline-flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-md border border-brand-500 px-4 py-2 text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
      >
        <ShoppingBag className="h-4 w-4" />
        {t('productCard.addToCart')}
      </button>
    </article>
  );
}

export default ProductCard;
