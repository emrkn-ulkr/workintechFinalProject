import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setFilter, setOffset } from '../actions/productActions';
import { addItemToCart } from '../actions/shoppingCartActions';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import { useTranslation } from '../hooks/useTranslation';
import { fetchCategoriesIfNeeded, fetchProducts } from '../thunks/productThunks';
import { buildCategoryPath } from '../utils/categoryPaths';
import { genderSlugToCode, getLocalizedCategoryTitle } from '../utils/categoryUtils';

function ShopPage() {
  const dispatch = useDispatch();
  const { t, language } = useTranslation();
  const { categoryId, gender } = useParams();
  const [sort, setSort] = useState('');
  const { categories, productList, total, limit, offset, filter, fetchState } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchCategoriesIfNeeded());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setOffset(0));
  }, [dispatch, categoryId]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        category: categoryId,
        filter,
        sort,
        limit,
        offset,
        append: offset > 0,
      }),
    );
  }, [dispatch, categoryId, filter, sort, limit, offset]);

  const activeCategory = useMemo(
    () => categories.find((category) => String(category.id) === String(categoryId)),
    [categories, categoryId],
  );

  const selectedGenderCode = useMemo(() => genderSlugToCode(gender), [gender]);

  const genderLabel = useMemo(() => {
    if (selectedGenderCode === 'k') {
      return t('category.women');
    }

    if (selectedGenderCode === 'e') {
      return t('category.men');
    }

    return null;
  }, [selectedGenderCode, t]);

  const visibleCategories = useMemo(() => {
    if (!selectedGenderCode) {
      return categories;
    }

    return categories.filter((category) => category.gender === selectedGenderCode);
  }, [categories, selectedGenderCode]);

  const hasMore = productList.length < total;

  const handleFilterChange = (event) => {
    dispatch(setOffset(0));
    dispatch(setFilter(event.target.value));
  };

  const handleSortChange = (event) => {
    dispatch(setOffset(0));
    setSort(event.target.value);
  };

  const handleLoadMore = () => {
    dispatch(setOffset(offset + limit));
  };

  const handleClearFilters = () => {
    dispatch(setOffset(0));
    dispatch(setFilter(''));
    setSort('');
  };

  const handleAddToCart = (product) => {
    dispatch(addItemToCart(product));
    toast.success(t('shop.addedToCart'));
  };

  const heading = activeCategory
    ? t('shop.categoryProducts', { category: getLocalizedCategoryTitle(activeCategory.title, language) })
    : genderLabel
      ? t('category.byGenderPrefix', { gender: genderLabel })
      : t('shop.allProducts');

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{t('shop.label')}</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink-900">{heading}</h1>
        <p className="mt-2 text-sm text-ink-500">{t('shop.resultsFound', { count: total })}</p>
      </section>

      <section className="flex flex-col gap-6 lg:flex-row">
        <aside className="space-y-4 rounded-2xl bg-white p-4 shadow-sm lg:w-[260px]">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-700">{t('common.categories')}</h2>
          <div className="flex flex-wrap gap-2 lg:flex-col">
            <Link
              to="/shop"
              className={`rounded-md border px-3 py-2 text-xs font-medium transition ${
                !categoryId
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-slate-200 text-ink-700 hover:bg-slate-100'
              }`}
            >
              {t('shop.allCategories')}
            </Link>
            {visibleCategories.map((category) => (
              <Link
                key={category.id}
                to={buildCategoryPath(category)}
                className={`rounded-md border px-3 py-2 text-xs font-medium transition ${
                  String(category.id) === String(categoryId)
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-ink-700 hover:bg-slate-100'
                }`}
              >
                {getLocalizedCategoryTitle(category.title, language)}
              </Link>
            ))}
          </div>
        </aside>

        <div className="flex-1 space-y-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={filter}
                onChange={handleFilterChange}
                type="text"
                placeholder={t('shop.filterPlaceholder')}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 sm:flex-1"
              />
              <select
                value={sort}
                onChange={handleSortChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 sm:w-[220px]"
              >
                <option value="">{t('shop.sortBy')}</option>
                <option value="price:asc">{t('shop.sortPriceAsc')}</option>
                <option value="price:desc">{t('shop.sortPriceDesc')}</option>
                <option value="rating:asc">{t('shop.sortRatingAsc')}</option>
                <option value="rating:desc">{t('shop.sortRatingDesc')}</option>
              </select>
            </div>
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-3 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-slate-100"
            >
              {t('shop.clearFilters')}
            </button>
          </div>

          {fetchState === 'FETCHING' && productList.length === 0 ? (
            <LoadingSpinner label={t('shop.productsLoading')} />
          ) : (
            <div className="flex flex-wrap gap-4">
              {productList.map((product) => (
                <div key={product.id} className="w-full sm:w-[calc(50%-0.5rem)] xl:w-[calc(33.333%-0.7rem)]">
                  <ProductCard product={product} categories={categories} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>
          )}

          {hasMore && fetchState !== 'FETCHING' && (
            <button
              type="button"
              onClick={handleLoadMore}
              className="w-full rounded-md border border-brand-500 px-4 py-3 text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
            >
              {t('shop.loadMoreProducts')}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default ShopPage;
