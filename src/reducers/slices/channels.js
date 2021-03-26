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
    },
    addTypingUser(state, action) {
      const userId = action.payload;
      state.usersTyping = [...state.usersTyping, userId];
    },
    removeUserTyping(state, action) {
      const userId = action.payload;
      state.usersTyping = state.usersTyping.filter(id => id !== userId);
    },
  },
});

export const { setChannelsList, setActiveChannel, setUsersTyping, addTypingUser, removeUserTyping } = channels.actions;

export default channels.reducer;
