import { combineReducers } from 'redux';
import { penderReducer } from 'redux-pender';
import base from './base';
import user from './user';
import auth from './auth';
import write from './write';
import tweets from './tweets';

export default combineReducers({
  base,
  user,
  auth,
  write,
  tweets,
  pender: penderReducer,
});
