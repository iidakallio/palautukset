import { createSlice } from '@reduxjs/toolkit';

let timeoutId;
const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    notificationChange(state, action) {
      return action.payload;
    },
    clearNotification() {
      return '';
    },
  },
});

export const setNotification = (message, seconds) => {
  return (dispatch) => {
    dispatch(notificationChange(message));
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      dispatch(clearNotification());
    }, seconds * 1000);
  };
};

export const { notificationChange, clearNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
