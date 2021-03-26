import { combineReducers } from 'redux';
import users from 'reducers/slices/users';
import channels from 'reducers/slices/channels';
import messages from 'reducers/slices/messages';

export default combineReducers({
  users,
  channels,
  messages
});
