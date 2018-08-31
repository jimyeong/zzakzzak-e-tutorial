import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { Provider } from 'react-redux';

import App from './App';
import configure from './store/configure';

// Koa 의 ctx 객체를 params 로 받아옴
const serverRender = async ctx => {
  // url 값 읽어오기
  const { url } = ctx;
  const store = configure(); // 매 요청마다 스토어 생성

  const html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={url} >
        <App />
      </StaticRouter>
    </Provider>
  );

  return {
    html,
    state: store.getState()
  };
}

export default serverRender;