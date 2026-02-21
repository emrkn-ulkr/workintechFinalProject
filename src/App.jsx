import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
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

  useEffect(() => {
    dispatch(verifyTokenFromStorage());
    dispatch(fetchCategoriesIfNeeded());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <PageContent>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route
            exact
            path="/shop/:gender/:categoryName/:categoryId/:productNameSlug/:productId"
            component={ProductDetailPage}
          />
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
      <ToastContainer position="top-right" autoClose={3200} />
    </div>
  );
}

export default App;
