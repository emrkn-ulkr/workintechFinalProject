import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addItemToCart } from '../actions/shoppingCartActions';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTranslation } from '../hooks/useTranslation';
import { fetchProductById } from '../thunks/productThunks';

function ProductDetailPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { productId } = useParams();
  const { t } = useTranslation();
  const [product, setProduct] = useState(null);
  const { fetchState } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProductById(productId))
      .then((data) => setProduct(data))
      .catch(() => {
        toast.error(t('productDetailPage.fetchError'));
      });
  }, [dispatch, productId, t]);

  if (fetchState === 'FETCHING' && !product) {
    return <LoadingSpinner label={t('productDetailPage.loading')} />;
  }

  if (!product) {
    return (
      <section className="rounded-2xl bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-ink-500">{t('productDetailPage.notFound')}</p>
      </section>
    );
  }

  const coverImage = product.images?.[0]?.url || 'https://via.placeholder.com/640x640?text=No+Image';

  const handleAddToCart = () => {
    dispatch(addItemToCart(product));
    toast.success(t('productDetailPage.addedToCart'));
  };

  return (
    <section className="space-y-5">
      <button
        type="button"
        onClick={() => history.goBack()}
        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-ink-700 hover:bg-slate-100"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('common.back')}
      </button>

      <div className="flex flex-col gap-6 rounded-2xl bg-white p-4 shadow-sm sm:p-6 lg:flex-row">
        <img src={coverImage} alt={product.name} className="h-[440px] w-full rounded-xl object-cover lg:w-1/2" />

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{t('productDetailPage.label')}</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">{product.name}</h1>
            <p className="mt-4 text-sm leading-6 text-ink-600">{product.description}</p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <div className="w-[calc(50%-0.4rem)] rounded-xl bg-slate-100 p-3">
                <p className="text-xs uppercase tracking-wide text-ink-500">{t('productDetailPage.price')}</p>
                <p className="mt-1 text-lg font-bold text-brand-700">
                  {Number(product.price || 0).toFixed(2)} {t('common.tl')}
                </p>
              </div>
              <div className="w-[calc(50%-0.4rem)] rounded-xl bg-slate-100 p-3">
                <p className="text-xs uppercase tracking-wide text-ink-500">{t('productDetailPage.stock')}</p>
                <p className="mt-1 text-lg font-bold text-ink-900">{product.stock}</p>
              </div>
              <div className="w-[calc(50%-0.4rem)] rounded-xl bg-slate-100 p-3">
                <p className="text-xs uppercase tracking-wide text-ink-500">{t('productDetailPage.rating')}</p>
                <p className="mt-1 text-lg font-bold text-ink-900">{Number(product.rating || 0).toFixed(2)}</p>
              </div>
              <div className="w-[calc(50%-0.4rem)] rounded-xl bg-slate-100 p-3">
                <p className="text-xs uppercase tracking-wide text-ink-500">{t('productDetailPage.sellCount')}</p>
                <p className="mt-1 text-lg font-bold text-ink-900">{product.sell_count}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-6 w-full rounded-md bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            {t('productDetailPage.addToCart')}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailPage;
