import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router';
import { Provider } from 'react-redux';

import App from './App';
import configure from './store/configure';
import routeConfig from 'routeConfig';

// Koa 의 ctx 객체를 params 로 받아옴
const serverRender = async ctx => {
  // url 값 읽어오기
  const { url, path } = ctx;
  const store = configure(); // 매 요청마다 스토어 생성

  const promises = []; // 기다릴 프로미스를 담을 배열
  let matched = false; // 일치하는 라우트가 있는지 확인
  routeConfig.forEach(route => {
    const match = matchPath(path, route); // url 이 아닌 path 값과 비교
    if (match) {
      matched = true;
    }
    // preload  함수가 존재한다면
    if (match && route.preload) {
      const p = route.preload(store, match.params, ctx);
      promises.push(p);
    }
  });


  let error = null;
  try {
    // 모든 프로미스가 끝날 때 까지 기다립니다.
    await Promise.all(promises);
  } catch (e) {
    error = e;
  }

  const html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={url} >
        <App />
      </StaticRouter>
    </Provider>
  );

  return {
    html,
    state: store.getState(),
    error
  };
}

export default serverRender;