import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addItemToCart } from '../actions/shoppingCartActions';
import CategoryGrid from '../components/CategoryGrid';
import HeroSlider from '../components/HeroSlider';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import { fetchCategoriesIfNeeded, fetchProducts } from '../thunks/productThunks';

function HomePage() {
  const dispatch = useDispatch();
  const { categories, productList, fetchState } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchCategoriesIfNeeded());
    dispatch(fetchProducts({ limit: 8, offset: 0 }));
  }, [dispatch]);

  const topCategories = [...categories].sort((a, b) => b.rating - a.rating).slice(0, 5);

  const handleAddToCart = (product) => {
    dispatch(addItemToCart(product));
    toast.success('Product added to cart.');
  };

  return (
    <div className="space-y-10">
      <HeroSlider />

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Top Categories</h2>
          <Link to="/shop" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            See all categories
          </Link>
        </div>
        <CategoryGrid categories={topCategories} />
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Featured Products</h2>
          <Link to="/shop" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            Go to shop
          </Link>
        </div>

        {fetchState === 'FETCHING' && productList.length === 0 ? (
          <LoadingSpinner label="Products loading..." />
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
