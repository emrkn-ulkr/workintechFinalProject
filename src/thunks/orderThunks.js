import axiosInstance from '../api/axiosInstance';
import { clearCart } from '../actions/shoppingCartActions';

const extractMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.response?.data?.[0]?.message ||
  fallback;

export const normalizeOrders = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.orders)) {
    return data.orders;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

export const getOrderProducts = (order) => {
  if (Array.isArray(order?.products)) {
    return order.products;
  }

  if (Array.isArray(order?.items)) {
    return order.items;
  }

  if (Array.isArray(order?.order_items)) {
    return order.order_items;
  }

  return [];
};

export const fetchOrders = () => async () => {
  try {
    const { data } = await axiosInstance.get('/order');
    return normalizeOrders(data);
  } catch (error) {
    throw new Error(extractMessage(error, 'Orders could not be fetched.'));
  }
};

export const createOrder = (payload) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.post('/order', payload);
    dispatch(clearCart());
    return data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Order could not be created.'));
  }
};

