import axiosInstance, { setAuthToken } from '../api/axiosInstance';
import { setAddressList, setCreditCards, setRoles, setUser } from '../actions/clientActions';

const TOKEN_KEY = 'token';

const extractMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.response?.data?.[0]?.message ||
  fallback;

const extractList = (data, keys = []) => {
  if (Array.isArray(data)) {
    return data;
  }

  for (const key of keys) {
    if (Array.isArray(data?.[key])) {
      return data[key];
    }
  }

  return [];
};

export const fetchRolesIfNeeded = () => async (dispatch, getState) => {
  const { roles } = getState().client;
  if (roles.length) {
    return roles;
  }

  const { data } = await axiosInstance.get('/roles');
  dispatch(setRoles(data));
  return data;
};

export const signupUser = (payload) => async () => {
  try {
    const { data } = await axiosInstance.post('/signup', payload);
    return data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Signup request failed.'));
  }
};

export const loginUser = ({ email, password, rememberMe = false }) => async (dispatch) => {
  try {
    // Login endpoint must be called without stale Authorization header.
    setAuthToken(null);
    const { data } = await axiosInstance.post('/login', { email, password });
    const { token, ...user } = data;
    dispatch(setUser(user));
    setAuthToken(token);

    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

    return data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Email or password is incorrect.'));
  }
};

export const verifyTokenFromStorage = () => async (dispatch) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return null;
  }

  try {
    setAuthToken(token);
    const { data } = await axiosInstance.get('/verify');
    const { token: refreshedToken, ...user } = data;
    dispatch(setUser(user));

    if (refreshedToken) {
      localStorage.setItem(TOKEN_KEY, refreshedToken);
      setAuthToken(refreshedToken);
    }

    return data;
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken(null);
    dispatch(setUser({}));
    return null;
  }
};

export const fetchUserAddresses = () => async (dispatch) => {
  try {
    const { data } = await axiosInstance.get('/user/address');
    const addressList = extractList(data, ['addresses', 'addressList']);
    dispatch(setAddressList(addressList));
    return addressList;
  } catch (error) {
    throw new Error(extractMessage(error, 'Address list could not be fetched.'));
  }
};

export const createUserAddress = (payload) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.post('/user/address', payload);
    await dispatch(fetchUserAddresses());
    return data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Address could not be created.'));
  }
};

export const updateUserAddress = (payload) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.put('/user/address', payload);
    await dispatch(fetchUserAddresses());
    return data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Address could not be updated.'));
  }
};

export const deleteUserAddress = (addressId) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.delete(`/user/address/${addressId}`);
    await dispatch(fetchUserAddresses());
    return data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Address could not be deleted.'));
  }
};

export const fetchUserCards = () => async (dispatch) => {
  try {
    const { data } = await axiosInstance.get('/user/card');
    const creditCards = extractList(data, ['cards', 'creditCards']);
    dispatch(setCreditCards(creditCards));
    return creditCards;
  } catch (error) {
    throw new Error(extractMessage(error, 'Card list could not be fetched.'));
  }
};

export const createUserCard = (payload) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.post('/user/card', payload);
    await dispatch(fetchUserCards());
    return data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Card could not be created.'));
  }
};

export const updateUserCard = (payload) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.put('/user/card', payload);
    await dispatch(fetchUserCards());
    return data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Card could not be updated.'));
  }
};

export const deleteUserCard = (cardId) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.delete(`/user/card/${cardId}`);
    await dispatch(fetchUserCards());
    return data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Card could not be deleted.'));
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem(TOKEN_KEY);
  setAuthToken(null);
  dispatch(setUser({}));
};
