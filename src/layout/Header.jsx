import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, LogOut, Menu, ShoppingCart, UserRound, X } from 'lucide-react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logoutUser } from '../thunks/clientThunks';
import { getGravatarUrl } from '../utils/gravatar';
import { buildCategoryPath } from '../utils/categoryPaths';

const navLinks = [
  { id: 1, label: 'Home', to: '/' },
  { id: 2, label: 'Shop', to: '/shop' },
  { id: 3, label: 'About', to: '/about' },
  { id: 4, label: 'Team', to: '/team' },
  { id: 5, label: 'Contact', to: '/contact' },
];

function Header() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { categories } = useSelector((state) => state.product);
  const { cart } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.client);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const itemCount = cart.reduce((sum, item) => sum + item.count, 0);
  const previewItems = cart.slice(0, 4);
  const isLoggedIn = Boolean(user?.email);

  const handleLogout = () => {
    dispatch(logoutUser());
    setProfileOpen(false);
    toast.info('Logged out successfully.');
    history.push('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="border-b border-slate-100 bg-brand-700 text-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6 lg:px-8">
          <p className="font-medium">Workintech E-commerce Final Project</p>
          <p className="hidden sm:block">Fast delivery and secure checkout</p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="font-display text-xl font-semibold tracking-tight text-ink-900">
            WT Store
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.id}
                exact={link.to === '/'}
                to={link.to}
                className="rounded-md px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-slate-100"
                activeClassName="bg-brand-50 text-brand-700"
              >
                {link.label}
              </NavLink>
            ))}

            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoriesOpen((current) => !current)}
                className="ml-2 inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-slate-100"
              >
                Categories
                <ChevronDown className="h-4 w-4" />
              </button>
              {categoriesOpen && (
                <div className="absolute right-0 top-11 max-h-80 w-64 overflow-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={buildCategoryPath(category)}
                      onClick={() => setCategoriesOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-slate-100"
                    >
                      {category.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <div className="group relative hidden sm:block">
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink-800 transition hover:bg-slate-50"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Cart</span>
                <span className="rounded-full bg-brand-500 px-2 py-0.5 text-xs text-white">{itemCount}</span>
              </Link>

              {previewItems.length > 0 && (
                <div className="absolute right-0 top-12 hidden w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-lg group-hover:block">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">Cart Preview</p>
                  {previewItems.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between border-b border-slate-100 py-2">
                      <p className="max-w-[160px] truncate text-sm font-medium text-ink-700">{item.product.name}</p>
                      <p className="text-xs text-ink-500">x{item.count}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setProfileOpen((current) => !current)}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink-800 transition hover:bg-slate-50"
                >
                  <img
                    src={getGravatarUrl(user.email, 48)}
                    alt={user.name}
                    className="h-6 w-6 rounded-full border border-slate-200"
                  />
                  <span>{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                    <Link
                      to="/orders"
                      className="block rounded-md px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-slate-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      Previous Orders
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink-800 transition hover:bg-slate-50 sm:inline-flex"
              >
                <UserRound className="h-4 w-4" />
                Login
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((current) => !current)}
              className="inline-flex items-center rounded-md border border-slate-200 p-2 text-ink-800 lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.id}
                exact={link.to === '/'}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-slate-100"
                activeClassName="bg-brand-50 text-brand-700"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">Categories</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={buildCategoryPath(category)}
                  onClick={() => setMobileOpen(false)}
                  className="w-[calc(50%-0.25rem)] rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-ink-700 transition hover:bg-slate-100"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink-800"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart ({itemCount})
            </Link>
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-md border border-red-300 px-3 py-2 text-sm font-semibold text-red-600"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink-800"
              >
                <UserRound className="h-4 w-4" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
