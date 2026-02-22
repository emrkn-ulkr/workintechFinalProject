import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { setLanguage, setTheme } from './actions/clientActions';
import ProtectedRoute from './components/ProtectedRoute';
import {
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  SUPPORTED_THEMES,
  THEME_STORAGE_KEY,
} from './constants/preferences';
import Footer from './layout/Footer';
import Header from './layout/Header';
import PageContent from './layout/PageContent';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import ContactPage from './pages/ContactPage';
import CreateOrderPage from './pages/CreateOrderPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import OrdersPage from './pages/OrdersPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ShopPage from './pages/ShopPage';
import SignupPage from './pages/SignupPage';
import TeamPage from './pages/TeamPage';
import { verifyTokenFromStorage } from './thunks/clientThunks';
import { fetchCategoriesIfNeeded } from './thunks/productThunks';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useDispatch();
  const { theme, language } = useSelector((state) => state.client);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (storedTheme && SUPPORTED_THEMES.includes(storedTheme)) {
      dispatch(setTheme(storedTheme));
    }

    if (storedLanguage && SUPPORTED_LANGUAGES.includes(storedLanguage)) {
      dispatch(setLanguage(storedLanguage));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(verifyTokenFromStorage());
    dispatch(fetchCategoriesIfNeeded());
  }, [dispatch]);

  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <PageContent>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route
            exact
            path="/shop/:gender/:categoryName/:categoryId/:productNameSlug/:productId"
            component={ProductDetailPage}
          />
          <Route exact path="/shop/:gender" component={ShopPage} />
          <Route exact path="/shop/:gender/:categoryName/:categoryId" component={ShopPage} />
          <Route exact path="/shop" component={ShopPage} />
          <Route exact path="/product/:productId" component={ProductDetailPage} />
          <Route exact path="/contact" component={ContactPage} />
          <Route exact path="/team" component={TeamPage} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/signup" component={SignupPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/cart" component={CartPage} />
          <ProtectedRoute exact path="/checkout" component={CreateOrderPage} />
          <ProtectedRoute exact path="/orders" component={OrdersPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </PageContent>
      <Footer />
      <ToastContainer position="top-right" autoClose={3200} theme={theme === 'dark' ? 'dark' : 'light'} />
    </div>
  );
}

export default App;
