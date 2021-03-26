import { createSlice } from '@reduxjs/toolkit';

const channels = createSlice({
  name: 'channels',
  initialState: {
    active: 0,
    list: [],
    usersTyping: [],
  },
  reducers: {
    setChannelsList(state, action) {
      state.list = action.payload;
    },
    setActiveChannel(state, action) {
      state.active = action.payload;
    },
    setUsersTyping(state, action) {
      state.usersTyping = action.payload;
    }
  },
});

export const { setChannelsList, setActiveChannel, setUsersTyping } = channels.actions;

export default channels.reducer;
