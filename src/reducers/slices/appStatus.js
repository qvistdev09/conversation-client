import { createSlice } from '@reduxjs/toolkit';

const appStatus = createSlice({
  name: 'appStatus',
  initialState: {
    connected: false,
    statusText: 'Connecting to server, please wait...',
  },
  reducers: {
    setConnectedStatus(state, action) {
      state.connected = action.payload;
    },
    setStatusText(state, action) {
      state.statusText = action.payload;
    },
  },
});

export const { setConnectedStatus, setStatusText } = appStatus.actions;

export default appStatus.reducer;
