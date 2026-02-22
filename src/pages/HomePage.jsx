import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addItemToCart } from '../actions/shoppingCartActions';
import CategoryGrid from '../components/CategoryGrid';
import HeroSlider from '../components/HeroSlider';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import { useTranslation } from '../hooks/useTranslation';
import { fetchCategoriesIfNeeded, fetchProducts } from '../thunks/productThunks';

function HomePage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { categories, productList, fetchState } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchCategoriesIfNeeded());
    dispatch(fetchProducts({ limit: 8, offset: 0 }));
  }, [dispatch]);

  const topCategories = [...categories]
    .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
    .slice(0, 5);

  const handleAddToCart = (product) => {
    dispatch(addItemToCart(product));
    toast.success(t('home.addedToCart'));
  };

  return (
    <div className="space-y-10">
      <HeroSlider />

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink-900">{t('home.topCategories')}</h2>
          <Link to="/shop" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            {t('home.seeAllCategories')}
          </Link>
        </div>
        <CategoryGrid categories={topCategories} />
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink-900">{t('home.featuredProducts')}</h2>
          <Link to="/shop" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            {t('home.goToShop')}
          </Link>
        </div>

        {fetchState === 'FETCHING' && productList.length === 0 ? (
          <LoadingSpinner label={t('home.productsLoading')} />
        ) : (
          <div className="flex flex-wrap gap-4">
            {productList.map((product) => (
              <div key={product.id} className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]">
                <ProductCard product={product} categories={categories} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
