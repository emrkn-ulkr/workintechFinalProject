import axiosInstance from '../api/axiosInstance';
import { setCategories, setFetchState, setProductList, setTotal } from '../actions/productActions';
import { normalizeAndSortCategories } from '../utils/categoryUtils';

const appendQuery = ({ category, filter, sort, limit, offset }) => {
  const params = new URLSearchParams();

  if (category) {
    params.set('category', category);
  }

  if (filter) {
    params.set('filter', filter);
  }

  if (sort) {
    params.set('sort', sort);
  }

  if (limit !== undefined && limit !== null) {
    params.set('limit', limit);
  }

  if (offset !== undefined && offset !== null) {
    params.set('offset', offset);
  }

  return params.toString();
};

export const fetchCategoriesIfNeeded = () => async (dispatch, getState) => {
  const { categories } = getState().product;
  if (categories.length) {
    return categories;
  }

  const { data } = await axiosInstance.get('/categories');
  const normalizedCategories = normalizeAndSortCategories(Array.isArray(data) ? data : []);
  dispatch(setCategories(normalizedCategories));
  return normalizedCategories;
};

export const fetchCategoryProductsTotal = async (categoryId) => {
  const queryString = appendQuery({ category: categoryId, limit: 1, offset: 0 });
  const url = queryString ? `/products?${queryString}` : '/products';
  const { data } = await axiosInstance.get(url);
  return Number(data?.total || 0);
};

export const fetchProducts = (options = {}) => async (dispatch, getState) => {
  const state = getState().product;
  const query = {
    category: options.category,
    filter: options.filter ?? state.filter,
    sort: options.sort ?? '',
    limit: options.limit ?? state.limit,
    offset: options.offset ?? state.offset,
  };

  dispatch(setFetchState('FETCHING'));

  try {
    const queryString = appendQuery(query);
    const url = queryString ? `/products?${queryString}` : '/products';
    const { data } = await axiosInstance.get(url);

    dispatch(setTotal(data.total || 0));

    if (options.append) {
      dispatch(setProductList([...state.productList, ...(data.products || [])]));
    } else {
      dispatch(setProductList(data.products || []));
    }

    dispatch(setFetchState('FETCHED'));
    return data;
  } catch (error) {
    dispatch(setFetchState('FAILED'));
    throw error;
  }
};

export const fetchProductById = (productId) => async (dispatch) => {
  dispatch(setFetchState('FETCHING'));

  try {
    const { data } = await axiosInstance.get(`/products/${productId}`);
    dispatch(setProductList([data]));
    dispatch(setTotal(1));
    dispatch(setFetchState('FETCHED'));
    return data;
  } catch (error) {
    dispatch(setFetchState('FAILED'));
    throw error;
  }
};
