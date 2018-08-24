import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { applyPenders } from 'redux-pender';
import * as api from 'lib/api';

const INITIALIZE = 'auth/INITIALIZE'; // 초기화
const CHANGE_INPUT = 'auth/CHANGE_INPUT'; // 인풋 값 변경
const SET_ERROR = 'auth/SET_ERROR'; // 에러 설정
const REGISTER = 'auth/REGISTER';
const LOGIN = 'auth/LOGIN';

export const initialize = createAction(INITIALIZE);
export const changeInput = createAction(CHANGE_INPUT, ({ field, value }) => ({
  field,
  value,
}));
export const login = createAction(LOGIN, api.login);
export const register = createAction(REGISTER, api.register);

const initialState = {
  fields: {
    username: '',
    password: '',
    passwordConfirm: '',
  },
  error: null,
};

const reducer = handleActions(
  {
    [INITIALIZE]: state => initialState,
    [CHANGE_INPUT]: (state, { payload: { field, value } }) => {
      return produce(state, draft => {
        draft.fields[field] = value;
      });
    },
    [SET_ERROR]: (state, { payload: error }) => {
      return produce(state, draft => {
        draft.error = error;
      });
    },
  },
  initialState
);

// 회원가입과 로그인은 오류가 발생하면 data.msg 에 에러메시지를 반환합니다.
// 만약에 에러메시지가 제대로 반환되지 않으면 알 수 없는 에러 발생이라고 띄웁니다.
export default applyPenders(reducer, [
  {
    type: REGISTER,
    onError: (state, action) => {
      return produce(state, draft => {
        const { response } = action.payload;
        if (!response || !response.data || !response.data.msg) {
          draft.error = '알 수 없는 에러 발생';
          return;
        }
        draft.error = response.data.msg;
      });
    },
  },
  {
    type: LOGIN,
    onError: (state, action) => {
      return produce(state, draft => {
        const { response } = action.payload;
        if (!response || !response.data || !response.data.msg) {
          draft.error = '알 수 없는 에러 발생';
          return;
        }
        draft.error = response.data.msg;
      });
    },
  },
]);
