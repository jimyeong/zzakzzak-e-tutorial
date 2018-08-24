import React from 'react';
import HideHeader from 'containers/base/HideHeader';
import AuthTemplate from 'components/auth/AuthTemplate';

const AuthPage = ({ match }) => {
  const { authType } = match.params;
  return (
    <AuthTemplate type={authType}>
      <HideHeader />
    </AuthTemplate>
  );
};

export default AuthPage;
