import React from 'react';
import { Route } from 'react-router-dom';
import AppTemplate from 'components/base/AppTemplate';
import Header from 'components/base/Header';
import { AuthPage, TweetsPage } from 'pages';

const App = () => {
  return (
    <AppTemplate header={<Header right="오른쪽" />}>
      {/* TweetsPage 는 3종류의 주소에서 사용됨*/}
      <Route exact path="/" component={TweetsPage} />
      <Route path="/users/:username" component={TweetsPage} />
      <Route path="/tags/:tag" component={TweetsPage} />

      <Route path="/:authType(login|register)" component={AuthPage} />
    </AppTemplate>
  );
};

export default App;
