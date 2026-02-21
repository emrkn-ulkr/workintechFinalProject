import {
  CART_ADD_ITEM,
  CART_CLEAR,
  CART_REMOVE_ITEM,
  CART_SET_ADDRESS,
  CART_SET_CART,
  CART_SET_PAYMENT,
  CART_TOGGLE_ITEM,
  CART_UPDATE_ITEM_COUNT,
} from '../store/actionTypes';

export const setCart = (cart) => ({
  type: CART_SET_CART,
  payload: cart,
});

export const setPayment = (payment) => ({
  type: CART_SET_PAYMENT,
  payload: payment,
});

export const setAddress = (address) => ({
  type: CART_SET_ADDRESS,
  payload: address,
});

export const addItemToCart = (product) => ({
  type: CART_ADD_ITEM,
  payload: product,
});

export const removeItemFromCart = (productId) => ({
  type: CART_REMOVE_ITEM,
  payload: productId,
});

export const updateCartItemCount = (payload) => ({
  type: CART_UPDATE_ITEM_COUNT,
  payload,
});

export const toggleCartItem = (productId) => ({
  type: CART_TOGGLE_ITEM,
  payload: productId,
});

export const clearCart = () => ({
  type: CART_CLEAR,
});
