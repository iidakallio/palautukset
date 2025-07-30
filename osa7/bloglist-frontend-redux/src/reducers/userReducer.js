import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/login';
import blogService from '../services/blogs';
import { setNotification } from './notificationReducer';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    clearUser() {
      return null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const initializeUser = () => {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      dispatch(setUser(user));
    }
  };
};

export const loginUser = (credentials) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login(credentials);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
      dispatch(setNotification('logged in successfully', 5));
    } catch (exception) {
      dispatch(setNotification('wrong username or password', 5));
    }
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('loggedBlogappUser');
    blogService.setToken(null);
    dispatch(clearUser());
    dispatch(setNotification('logged out successfully', 5));
  };
};

export default userSlice.reducer;