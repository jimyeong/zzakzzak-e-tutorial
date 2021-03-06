import { createAction, handleActions } from 'redux-actions';
import { applyPenders } from 'redux-pender';
import produce from 'immer';
import * as api from 'lib/api';

const GET_INITIAL = 'tweets/GET_INITIAL'; // 초기 로딩
const GET_RECENT = 'tweets/GET_RECENT'; // 추가 로딩 (스크롤링 시)
const GET_NEXT = 'tweets/GET_NEXT'; // 최근 로딩 (최근 작성된것들만 로딩)
const OPEN_REMOVE_MODAL = 'tweets/OPEN_REMOVE_MODAL';
const CLOSE_REMOVE_MODAL = 'tweets/CLOSE_REMOVE_MODAL';
const REMOVE = 'tweets/REMOVE';

export const getInitial = createAction(GET_INITIAL, api.getList);
export const getRecent = createAction(GET_RECENT, api.getList);
export const getNext = createAction(GET_NEXT, api.getList);
export const openRemoveModal = createAction(
  OPEN_REMOVE_MODAL,
  ({ id, needPass }) => ({ id, needPass })
);
export const closeRemoveModal = createAction(CLOSE_REMOVE_MODAL);
export const remove = createAction(REMOVE, api.remove, meta => meta);

const initialState = {
  list: null, // 데이터
  end: false, // 리스팅이 모두 끝났음을 명시
  removeModal: {
    open: false,
    needPass: false,
    id: null,
    error: null,
  },
};

const reducer = handleActions(
  {
    [OPEN_REMOVE_MODAL]: (state, action) => {
      return produce(state, draft => {
        draft.removeModal.open = true;
        draft.removeModal.id = action.payload.id;
        draft.removeModal.error = null;
        draft.removeModal.needPass = action.payload.needPass;
      });
    },
    [CLOSE_REMOVE_MODAL]: (state, action) => {
      return produce(state, draft => {
        draft.removeModal.open = false;
      });
    },
  },
  initialState
);

export default applyPenders(reducer, [
  {
    type: GET_INITIAL,
    onSuccess: (state, action) => {
      return {
        ...state,
        list: action.payload.data,
        end: action.payload.data.length < 10, // 10개 미만 받아오면 더 불러올 데이터 없는 것
      };
    },
  },
  {
    type: GET_RECENT,
    onSuccess: (state, action) => {
      return {
        ...state,
        // 불러온 데이터를 기존 데이터 앞 부분에다가 추가
        list: action.payload.data.concat(state.list),
      };
    },
  },
  {
    type: GET_NEXT,
    onSuccess: (state, action) => {
      return {
        ...state,
        // 불러온 데이터를 기존 데이터 뒷 부분에다가 추가
        list: state.list.concat(action.payload.data),
        end: action.payload.data.length < 10, // 10개 미만이면 더 이상 불러올 데이터 없음
      };
    },
  },
  {
    type: REMOVE,
    onSuccess: (state, action) => {
      return produce(state, draft => {
        // 성공시 해당 짹짹이 제거
        draft.list = draft.list.filter(item => item._id !== action.meta.id);
      });
    },
    onError: (state, action) => {
      // 실패시 에러 보여주기
      if (!action.payload) return state;
      const { status } = action.payload.response;
      return produce(state, draft => {
        if (status === 403) {
          draft.removeModal.error = '잘못된 비밀번호입니다.';
        } else {
          draft.removeModal.error = '알 수 없는 에러 발생!';
        }
      });
    },
  },
]);
