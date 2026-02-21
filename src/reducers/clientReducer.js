import {
  CLIENT_SET_ADDRESS_LIST,
  CLIENT_SET_CREDIT_CARDS,
  CLIENT_SET_LANGUAGE,
  CLIENT_SET_ROLES,
  CLIENT_SET_THEME,
  CLIENT_SET_USER,
} from '../store/actionTypes';

const initialState = {
  user: {},
  addressList: [],
  creditCards: [],
  roles: [],
  theme: 'light',
  language: 'tr',
};

const clientReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLIENT_SET_USER:
      return { ...state, user: action.payload };
    case CLIENT_SET_ROLES:
      return { ...state, roles: action.payload };
    case CLIENT_SET_THEME:
      return { ...state, theme: action.payload };
    case CLIENT_SET_LANGUAGE:
      return { ...state, language: action.payload };
    case CLIENT_SET_ADDRESS_LIST:
      return { ...state, addressList: action.payload };
    case CLIENT_SET_CREDIT_CARDS:
      return { ...state, creditCards: action.payload };
    default:
      return state;
  }
};

export default clientReducer;
