import axiosInstance, { setAuthToken } from '../api/axiosInstance';
import { setRoles, setUser } from '../actions/clientActions';

const TOKEN_KEY = 'token';

const extractMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.response?.data?.[0]?.message ||
  fallback;

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

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem(TOKEN_KEY);
  setAuthToken(null);
  dispatch(setUser({}));
};
