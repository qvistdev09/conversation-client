import { createSlice } from '@reduxjs/toolkit';

const users = createSlice({
  name: 'users',
  initialState: {
    clientId: null,
    clientBlocked: false,
    list: [],
  },
  reducers: {
    setList(state, action) {
      state.list = action.payload;
    },
    setClientId(state, action) {
      state.clientId = action.payload;
    },
    setSpamBlock(state, action) {
      state.clientBlocked = action.payload;
    }
  },
});

const getClientName = ({ users }) => {
  const { clientId, list } = users;
  const match = list.find(user => user.id === clientId);
  return match ? match.name : '. . .';
};

const getClientIcon = ({ users }) => {
  const { clientId, list } = users;
  const match = list.find(user => user.id === clientId);
  if (match && match.icon) {
    return match.icon;
  }
  return '0';
};

const getClientColor = ({ users }) => {
  const { clientId, list } = users;
  const match = list.find(user => user.id === clientId);
  return match ? match.color : '#89f0a4';
};

export { getClientName, getClientIcon, getClientColor };

export const { setList, setClientId, setSpamBlock } = users.actions;

export default users.reducer;
