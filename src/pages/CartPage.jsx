import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';
import { Link, useHistory } from 'react-router-dom';
import { removeItemFromCart, toggleCartItem, updateCartItemCount } from '../actions/shoppingCartActions';

function CartPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { cart } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.client);

  const selectedItems = cart.filter((item) => item.checked);

  const totals = useMemo(() => {
    const productsTotal = selectedItems.reduce((sum, item) => sum + item.product.price * item.count, 0);
    const shipping = productsTotal > 0 ? 39.9 : 0;
    const discount = productsTotal > 1000 ? productsTotal * 0.08 : 0;
    const grandTotal = productsTotal + shipping - discount;
    return { productsTotal, shipping, discount, grandTotal };
  }, [selectedItems]);

  const handleCheckout = () => {
    if (user?.email) {
      history.push('/checkout');
      return;
    }

    history.push('/login', { from: history.location });
  };

  if (cart.length === 0) {
    return (
      <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Your cart is empty</h1>
        <p className="mt-3 text-sm text-ink-500">Add products from shop page to continue.</p>
        <Link
          to="/shop"
          className="mt-5 inline-flex rounded-md bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Go to Shop
        </Link>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 xl:flex-row">
      <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6 xl:flex-1">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Shopping Cart</h1>

        <div className="mt-5 space-y-3">
          {cart.map((item) => (
            <article key={item.product.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => dispatch(toggleCartItem(item.product.id))}
                className="h-4 w-4"
              />
              <img
                src={item.product.images?.[0]?.url}
                alt={item.product.name}
                className="h-14 w-14 rounded-md object-cover"
              />
              <div className="flex-1">
                <h2 className="truncate text-sm font-semibold text-ink-900">{item.product.name}</h2>
                <p className="text-xs text-ink-500">{item.product.price.toFixed(2)} TL</p>
                <div className="mt-2 inline-flex items-center rounded-md border border-slate-300">
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(
                        updateCartItemCount({
                          productId: item.product.id,
                          count: Math.max(1, item.count - 1),
                        }),
                      )
                    }
                    className="px-2 py-1 text-sm font-semibold"
                  >
                    -
                  </button>
                  <span className="px-2 py-1 text-sm font-semibold">{item.count}</span>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(
                        updateCartItemCount({
                          productId: item.product.id,
                          count: item.count + 1,
                        }),
                      )
                    }
                    className="px-2 py-1 text-sm font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => dispatch(removeItemFromCart(item.product.id))}
                className="inline-flex rounded-md border border-red-300 p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>
      </div>

      <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm xl:w-[320px]">
        <h2 className="font-display text-xl font-semibold text-ink-900">Order Summary</h2>

        <div className="mt-4 space-y-2 text-sm text-ink-600">
          <div className="flex items-center justify-between">
            <span>Products total</span>
            <span>{totals.productsTotal.toFixed(2)} TL</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span>{totals.shipping.toFixed(2)} TL</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span>-{totals.discount.toFixed(2)} TL</span>
          </div>
          <div className="my-2 border-t border-slate-200" />
          <div className="flex items-center justify-between text-base font-semibold text-ink-900">
            <span>Grand total</span>
            <span>{totals.grandTotal.toFixed(2)} TL</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={selectedItems.length === 0}
          className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Create Order
        </button>
      </aside>
    </section>
  );
}

export default CartPage;
