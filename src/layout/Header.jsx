import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, LogOut, Menu, ShoppingCart, SunMoon, UserRound, X } from 'lucide-react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLanguage, setTheme } from '../actions/clientActions';
import { useTranslation } from '../hooks/useTranslation';
import { logoutUser } from '../thunks/clientThunks';
import { buildCategoryPath } from '../utils/categoryPaths';
import { getLocalizedCategoryTitle } from '../utils/categoryUtils';
import { getGravatarUrl } from '../utils/gravatar';

function Header() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t, language } = useTranslation();
  const { categories } = useSelector((state) => state.product);
  const { cart } = useSelector((state) => state.shoppingCart);
  const { user, theme } = useSelector((state) => state.client);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = useMemo(
    () => [
      { id: 1, label: t('common.home'), to: '/' },
      { id: 2, label: t('common.shop'), to: '/shop' },
      { id: 3, label: t('common.about'), to: '/about' },
      { id: 4, label: t('common.team'), to: '/team' },
      { id: 5, label: t('common.contact'), to: '/contact' },
    ],
    [t],
  );

  const itemCount = cart.reduce((sum, item) => sum + item.count, 0);
  const previewItems = cart;
  const isLoggedIn = Boolean(user?.email);

  const handleLogout = () => {
    dispatch(logoutUser());
    setProfileOpen(false);
    toast.info(t('header.logoutSuccess'));
    history.push('/');
  };

  const handleThemeToggle = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'));
  };

  const handleLanguageChange = (event) => {
    dispatch(setLanguage(event.target.value));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:bg-slate-900/95">
      <div className="border-b border-slate-100 bg-brand-700 text-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6 lg:px-8">
          <p className="font-medium">{t('header.announcementTitle')}</p>
          <div className="flex items-center gap-3">
            <p className="hidden sm:block">{t('header.announcementSubtitle')}</p>
            <button
              type="button"
              aria-label={t('header.themeToggle')}
              onClick={handleThemeToggle}
              className="hidden items-center gap-1 rounded-md border border-white/30 px-2 py-1 text-[11px] font-semibold transition hover:bg-white/10 sm:inline-flex"
            >
              <SunMoon className="h-3.5 w-3.5" />
              {theme === 'dark' ? t('common.dark') : t('common.light')}
            </button>
            <label className="hidden items-center gap-1 sm:inline-flex">
              <span className="sr-only">{t('header.languageSelect')}</span>
              <select
                aria-label={t('header.languageSelect')}
                value={language}
                onChange={handleLanguageChange}
                className="rounded-md border border-white/30 bg-white/10 px-2 py-1 text-[11px] font-semibold text-white outline-none"
              >
                <option className="text-slate-900" value="tr">
                  TR
                </option>
                <option className="text-slate-900" value="en">
                  EN
                </option>
              </select>
            </label>
          </div>
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
                {t('header.categoryMenu')}
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
                      {getLocalizedCategoryTitle(category.title, language)}
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
                <span>{t('common.cart')}</span>
                <span className="rounded-full bg-brand-500 px-2 py-0.5 text-xs text-white">{itemCount}</span>
              </Link>

              {previewItems.length > 0 && (
                <div className="absolute right-0 top-12 hidden max-h-96 w-72 overflow-auto rounded-xl border border-slate-200 bg-white p-3 shadow-lg group-hover:block">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">{t('header.cartPreview')}</p>
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
                    alt={user.name || 'User'}
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
                      {t('common.previousOrders')}
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('common.logout')}
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
                {t('common.login')}
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((current) => !current)}
              className="inline-flex items-center rounded-md border border-slate-200 p-2 text-ink-800 lg:hidden"
              aria-label={mobileOpen ? t('header.mobileMenuClose') : t('header.mobileMenuOpen')}
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

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleThemeToggle}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-ink-700"
            >
              <SunMoon className="h-4 w-4" />
              {theme === 'dark' ? t('common.dark') : t('common.light')}
            </button>
            <select
              aria-label={t('header.languageSelect')}
              value={language}
              onChange={handleLanguageChange}
              className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-ink-700"
            >
              <option value="tr">TR</option>
              <option value="en">EN</option>
            </select>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">{t('common.categories')}</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={buildCategoryPath(category)}
                  onClick={() => setMobileOpen(false)}
                  className="w-[calc(50%-0.25rem)] rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-ink-700 transition hover:bg-slate-100"
                >
                  {getLocalizedCategoryTitle(category.title, language)}
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
              {t('common.cart')} ({itemCount})
            </Link>
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-md border border-red-300 px-3 py-2 text-sm font-semibold text-red-600"
              >
                <LogOut className="h-4 w-4" />
                {t('common.logout')}
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink-800"
              >
                <UserRound className="h-4 w-4" />
                {t('common.login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
