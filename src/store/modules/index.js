import { combineReducers } from 'redux';
import { penderReducer } from 'redux-pender';
import base from './base';
import user from './user';
import auth from './auth';
import write from './write';

export default combineReducers({
  base,
  user,
  auth,
  write,
  pender: penderReducer,
});
