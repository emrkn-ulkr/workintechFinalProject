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

const initialState = {
  cart: [],
  payment: {},
  address: {},
};

const withNormalizedId = (id) => String(id);

const shoppingCartReducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_SET_CART:
      return { ...state, cart: action.payload };
    case CART_SET_PAYMENT:
      return { ...state, payment: action.payload };
    case CART_SET_ADDRESS:
      return { ...state, address: action.payload };
    case CART_ADD_ITEM: {
      const product = action.payload;
      const targetId = withNormalizedId(product.id);
      const existingItem = state.cart.find((item) => withNormalizedId(item.product.id) === targetId);

      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            withNormalizedId(item.product.id) === targetId ? { ...item, count: item.count + 1 } : item,
          ),
        };
      }

      return {
        ...state,
        cart: [...state.cart, { count: 1, checked: true, product }],
      };
    }
    case CART_REMOVE_ITEM: {
      const targetId = withNormalizedId(action.payload);
      return {
        ...state,
        cart: state.cart.filter((item) => withNormalizedId(item.product.id) !== targetId),
      };
    }
    case CART_UPDATE_ITEM_COUNT: {
      const targetId = withNormalizedId(action.payload.productId);
      const nextCount = Number(action.payload.count);
      return {
        ...state,
        cart: state.cart
          .map((item) => {
            if (withNormalizedId(item.product.id) !== targetId) {
              return item;
            }
            return { ...item, count: Math.max(1, nextCount) };
          })
          .filter((item) => item.count > 0),
      };
    }
    case CART_TOGGLE_ITEM: {
      const targetId = withNormalizedId(action.payload);
      return {
        ...state,
        cart: state.cart.map((item) =>
          withNormalizedId(item.product.id) === targetId ? { ...item, checked: !item.checked } : item,
        ),
      };
    }
    case CART_CLEAR:
      return { ...state, cart: [], payment: {}, address: {} };
    default:
      return state;
  }
};

export default shoppingCartReducer;
