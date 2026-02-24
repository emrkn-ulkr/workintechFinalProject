import axiosInstance, { setAuthToken } from '../api/axiosInstance';
import { setAddressList, setCreditCards, setRoles, setUser } from '../actions/clientActions';

const TOKEN_KEY = 'token';
const DUPLICATE_RECORD_CODE = 'SQLITE_CONSTRAINT';

const extractMessage = (error, fallback) => {
  const responseData = error.response?.data;

  if (typeof responseData?.message === 'string' && responseData.message.trim()) {
    return responseData.message;
  }

  if (Array.isArray(responseData) && typeof responseData[0]?.message === 'string') {
    return responseData[0].message;
  }

  if (Array.isArray(responseData?.errors) && typeof responseData.errors[0]?.message === 'string') {
    return responseData.errors[0].message;
  }

  if (
    responseData?.err?.code === DUPLICATE_RECORD_CODE ||
    (responseData?.error === 'An error occurred' && responseData?.err?.code === DUPLICATE_RECORD_CODE)
  ) {
    return 'This email is already registered.';
  }

  if (typeof responseData?.error === 'string' && responseData.error.trim()) {
    return responseData.error;
  }

  if (typeof error.message === 'string' && error.message.trim()) {
    return error.message;
  }

  return fallback;
};

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

  try {
    const { data } = await axiosInstance.get('/roles');
    const roleList = Array.isArray(data) ? data : [];
    dispatch(setRoles(roleList));
    return roleList;
  } catch (error) {
    throw new Error(extractMessage(error, 'Roles could not be fetched.'));
  }
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
  const previousToken = axiosInstance.defaults.headers.common.Authorization;

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
    if (previousToken) {
      setAuthToken(previousToken);
    }
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
