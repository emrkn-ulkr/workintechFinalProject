import { Fragment, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ChevronDown, ChevronUp } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTranslation } from '../hooks/useTranslation';
import { fetchOrders, getOrderProducts } from '../thunks/orderThunks';

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

function OrdersPage() {
  const dispatch = useDispatch();
  const { t, language } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedIds, setExpandedIds] = useState({});

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await dispatch(fetchOrders());
        setOrders(Array.isArray(response) ? response : []);
      } catch (requestError) {
        setError(requestError.message || t('ordersPage.loadError'));
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [dispatch, t]);

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (left, right) =>
          new Date(right.order_date || right.created_at || 0).getTime() -
          new Date(left.order_date || left.created_at || 0).getTime(),
      ),
    [orders],
  );

  const toggleExpanded = (orderId) => {
    setExpandedIds((current) => ({ ...current, [orderId]: !current[orderId] }));
  };

  if (loading) {
    return <LoadingSpinner label={t('ordersPage.loading')} />;
  }

  if (error) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{t('ordersPage.label')}</p>
      <h1 className="font-display text-3xl font-semibold text-ink-900">{t('ordersPage.title')}</h1>

      {sortedOrders.length === 0 ? (
        <p className="text-sm text-ink-500">{t('ordersPage.empty')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-ink-500">
                <th className="px-2 py-3">{t('ordersPage.orderNo')}</th>
                <th className="px-2 py-3">{t('ordersPage.orderDate')}</th>
                <th className="px-2 py-3">{t('ordersPage.orderTotal')}</th>
                <th className="px-2 py-3">{t('ordersPage.orderProductCount')}</th>
                <th className="px-2 py-3">{t('ordersPage.orderStatus')}</th>
                <th className="px-2 py-3">{t('ordersPage.orderActions')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => {
                const products = getOrderProducts(order);
                const isExpanded = Boolean(expandedIds[order.id]);
                const totalPrice =
                  toNumber(order.price) ||
                  products.reduce((sum, product) => sum + toNumber(product.price) * toNumber(product.count || 1), 0);

                return (
                  <Fragment key={order.id}>
                    <tr className="border-b border-slate-100 align-middle">
                      <td className="px-2 py-3 font-semibold text-ink-900">#{order.id}</td>
                      <td className="whitespace-nowrap px-2 py-3 text-ink-700">
                        {new Date(order.order_date || order.created_at || Date.now()).toLocaleString(
                          language === 'tr' ? 'tr-TR' : 'en-US',
                        )}
                      </td>
                      <td className="whitespace-nowrap px-2 py-3 text-ink-900">
                        {totalPrice.toFixed(2)} {t('common.tl')}
                      </td>
                      <td className="px-2 py-3 text-ink-700">{products.length}</td>
                      <td className="px-2 py-3 text-ink-700">
                        {order.status || order.state || t('ordersPage.statusCompleted')}
                      </td>
                      <td className="px-2 py-3">
                        <button
                          type="button"
                          onClick={() => toggleExpanded(order.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-slate-100"
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          {isExpanded ? t('ordersPage.hideDetails') : t('ordersPage.showDetails')}
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="border-b border-slate-100">
                        <td colSpan={6} className="bg-slate-50 px-3 py-3">
                          {products.length === 0 ? (
                            <p className="text-xs text-ink-500">{t('ordersPage.noProducts')}</p>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="min-w-full border-collapse text-xs">
                                <thead>
                                  <tr className="border-b border-slate-200 text-left uppercase tracking-wide text-ink-500">
                                    <th className="px-2 py-2">{t('ordersPage.itemProductId')}</th>
                                    <th className="px-2 py-2">{t('ordersPage.itemCount')}</th>
                                    <th className="px-2 py-2">{t('ordersPage.itemDetail')}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {products.map((product, index) => (
                                    <tr key={`${order.id}-${product.product_id || index}`} className="border-b border-slate-100">
                                      <td className="px-2 py-2 text-ink-700">{product.product_id || product.id || '-'}</td>
                                      <td className="px-2 py-2 text-ink-700">{product.count || 1}</td>
                                      <td className="px-2 py-2 text-ink-700">{product.detail || '-'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default OrdersPage;
