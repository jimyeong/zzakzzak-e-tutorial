import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, matchPath } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.scss';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import configure from 'store/configure';
import routeConfig from 'routeConfig';

const store = configure(window.__PRELOADED_STATE__);

const renderAfterPreload = async () => {
  if (process.env.NODE_ENV === 'production') {
    const promises = []; // 기다릴 프로미스를 담을 배열
    routeConfig.forEach(route => {
      const match = matchPath(window.location.pathname, route);
      // preloadComponent  함수가 존재한다면
      if (match && route.component.preloadComponent) {
        const p = route.component.preloadComponent();
        promises.push(p);
      }
    });

    try {
      await Promise.all(promises); // 다 끝날 때 까지 대기
    } catch (e) {
      console.log(e);
    }
  }

  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  );
}

renderAfterPreload();

// registerServiceWorker();
