import { createAction, handleActions } from 'redux-actions';

const initialState = {
  user: null, // 현재 유저 상태
  tokenExp: null, // 토큰 만료 시간
};

const reducer = handleActions({}, initialState);

export default reducer;
