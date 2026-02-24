import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

function Footer() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <footer className="mt-10 border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]">
          <h3 className="font-display text-lg font-semibold text-ink-900">WT Store</h3>
          <p className="mt-3 text-sm text-ink-500">{t('footer.description')}</p>
        </div>
        <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-ink-700">{t('footer.pages')}</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-ink-500">
            <Link to="/">{t('common.home')}</Link>
            <Link to="/shop">{t('common.shop')}</Link>
            <Link to="/about">{t('common.about')}</Link>
            <Link to="/team">{t('common.team')}</Link>
          </div>
        </div>
        <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-ink-700">{t('footer.account')}</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-ink-500">
            <Link to={{ pathname: '/signup', state: { from: location } }}>{t('common.signup')}</Link>
            <Link to={{ pathname: '/login', state: { from: location } }}>{t('common.login')}</Link>
            <Link to="/cart">{t('common.cart')}</Link>
            <Link to="/orders">{t('common.previousOrders')}</Link>
          </div>
        </div>
        <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-ink-700">{t('footer.contact')}</h4>
          <div className="mt-3 space-y-2 text-sm text-ink-500">
            <p>Istanbul, Turkey</p>
            <p>support@wtstore.dev</p>
            <p>+90 555 123 45 67</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-ink-500">{t('footer.copyright')}</div>
    </footer>
  );
}

export default Footer;
