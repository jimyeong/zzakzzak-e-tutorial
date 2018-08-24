import React from 'react';
import AppTemplate from 'components/base/AppTemplate';
import Header from 'components/base/Header';

const App = () => {
  return <AppTemplate header={<Header right="오른쪽" />}>내용이 들어갈자리</AppTemplate>;
};

export default App;
