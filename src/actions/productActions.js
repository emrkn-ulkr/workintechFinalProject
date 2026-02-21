import {
  PRODUCT_SET_CATEGORIES,
  PRODUCT_SET_FETCH_STATE,
  PRODUCT_SET_FILTER,
  PRODUCT_SET_LIMIT,
  PRODUCT_SET_OFFSET,
  PRODUCT_SET_PRODUCT_LIST,
  PRODUCT_SET_TOTAL,
} from '../store/actionTypes';

export const setCategories = (categories) => ({
  type: PRODUCT_SET_CATEGORIES,
  payload: categories,
});

export const setProductList = (productList) => ({
  type: PRODUCT_SET_PRODUCT_LIST,
  payload: productList,
});

export const setTotal = (total) => ({
  type: PRODUCT_SET_TOTAL,
  payload: total,
});

export const setFetchState = (fetchState) => ({
  type: PRODUCT_SET_FETCH_STATE,
  payload: fetchState,
});

export const setLimit = (limit) => ({
  type: PRODUCT_SET_LIMIT,
  payload: limit,
});

export const setOffset = (offset) => ({
  type: PRODUCT_SET_OFFSET,
  payload: offset,
});

export const setFilter = (filter) => ({
  type: PRODUCT_SET_FILTER,
  payload: filter,
});
