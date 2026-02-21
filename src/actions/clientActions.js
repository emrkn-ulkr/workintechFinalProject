import {
  CLIENT_SET_ADDRESS_LIST,
  CLIENT_SET_CREDIT_CARDS,
  CLIENT_SET_LANGUAGE,
  CLIENT_SET_ROLES,
  CLIENT_SET_THEME,
  CLIENT_SET_USER,
} from '../store/actionTypes';

export const setUser = (user) => ({
  type: CLIENT_SET_USER,
  payload: user,
});

export const setRoles = (roles) => ({
  type: CLIENT_SET_ROLES,
  payload: roles,
});

export const setTheme = (theme) => ({
  type: CLIENT_SET_THEME,
  payload: theme,
});

export const setLanguage = (language) => ({
  type: CLIENT_SET_LANGUAGE,
  payload: language,
});

export const setAddressList = (addressList) => ({
  type: CLIENT_SET_ADDRESS_LIST,
  payload: addressList,
});

export const setCreditCards = (creditCards) => ({
  type: CLIENT_SET_CREDIT_CARDS,
  payload: creditCards,
});
