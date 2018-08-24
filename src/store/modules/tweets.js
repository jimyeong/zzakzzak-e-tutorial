import { createAction, handleActions } from 'redux-actions';
import { applyPenders } from 'redux-pender';
import * as api from 'lib/api';

const GET_INITIAL = 'tweets/GET_INITIAL'; // 초기 로딩
const GET_RECENT = 'tweets/GET_RECENT'; // 추가 로딩 (스크롤링 시)
const GET_NEXT = 'tweets/GET_NEXT'; // 최근 로딩 (최근 작성된것들만 로딩)

export const getInitial = createAction(GET_INITIAL, api.getList);
export const getRecent = createAction(GET_RECENT, api.getList);
export const getNext = createAction(GET_NEXT, api.getList);

const initialState = {
  list: null, // 데이터
  end: false, // 리스팅이 모두 끝났음을 명시
};

const reducer = handleActions({}, initialState);

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
]);
