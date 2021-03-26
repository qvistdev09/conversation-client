import { combineReducers } from 'redux';
import users from 'reducers/slices/users';
import channels from 'reducers/slices/channels';

export default combineReducers({
  users,
  channels
});
