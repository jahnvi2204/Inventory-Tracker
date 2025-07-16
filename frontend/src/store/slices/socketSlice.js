import { createSlice } from '@reduxjs/toolkit';

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    // Remove socket instance from state
  },
  reducers: {
    // Remove setSocket reducer
  },
});

// Remove setSocket export
export default socketSlice.reducer; 