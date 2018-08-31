import { TweetsPage, AuthPage } from 'pages';
import { getInitial } from 'store/modules/tweets';
import { hideHeader } from 'store/modules/base';

// 각 라우트에서 필요한 데이터를 미리 불러오는 로직을 여기서 구현합니다.
// 데이터를 로딩하지 않더라도, 예를 들어 회원가입/로그인 페이지에서 헤더를 숨겨야하는데
// 여기서 HIDE_HEADER 액션을 미리 발생시켜서  서버사이드 렌더링 결과에서도 헤더를 숨길 수 있습니다. 

export default [
  {
    exact: true,
    path: '/',
    component: TweetsPage,
    preload: (store, params, ctx) => {
      // Promise 를 반환해야함
      return store.dispatch(getInitial());
    },
  },
  {
    exact: true,
    path: '/users/:username',
    component: TweetsPage,
    preload: (store, params, ctx) => {
      const { username } = params;
      return store.dispatch(getInitial({ username }));
    },
  },
  {
    exact: true,
    path: '/tags/:tag',
    component: TweetsPage,
    preload: (store, params, ctx) => {
      const { tag } = params;
      // 한글도 잘 인식하기 위하여 decodeURI 를 해줘야함.
      return store.dispatch(getInitial({ tag: decodeURI(tag) }));
      // 혹시나 query 를 사용해야 한다면, ctx.query 안에 들어있음.
    },
  },
  {
    path: '/:authType(login|register)',
    component: AuthPage,
    preload: store => {
      store.dispatch(hideHeader());
      return Promise.resolve(); // Promise 를 리턴해야 되기 떄문에 비어있는 Promise 생성해서 반환
    },
  },
]