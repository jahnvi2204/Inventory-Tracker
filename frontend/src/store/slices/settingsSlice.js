import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    theme: 'dark',
    notifications: {
      email: true,
      sms: false,
    },
  },
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
    },
    setNotifications(state, action) {
      state.notifications = action.payload;
    },
  },
});

export const { setTheme, setNotifications } = settingsSlice.actions;
export default settingsSlice.reducer; 