import { createSlice } from '@reduxjs/toolkit';

const messages = createSlice({
  name: 'messages',
  initialState: {
    constructed: [],
    new: [],
  },
  reducers: {
    setConstructedMessages(state, action) {
      state.constructed = action.payload;
    },
    addOneNewInChannel(state, action) {
      const channelId = action.payload;
      const match = state.new.find(container => container.id === channelId);
      if (match) {
        match.new += 1;
      } else {
        state.new.push({ id: channelId, new: 1 });
      }
    },
    clearAllNew(state, action) {
      const channelId = action.payload;
      const match = state.new.find(container => container.id === channelId);
      if (match) {
        match.new = 0;
      }
    },
  },
});

export const { setConstructedMessages, addOneNewInChannel, clearAllNew } = messages.actions;

export default messages.reducer;
