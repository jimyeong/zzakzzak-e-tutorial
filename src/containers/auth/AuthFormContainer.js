import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import AuthForm from 'components/auth/AuthForm';
import * as authActions from 'store/modules/auth';

class AuthFormContainer extends Component {
  handleChange = e => {
    // e.target 에서 인풋의 변화 정보를 가져오고
    const { name, value } = e.target;
    // 액션을 발생시켜 리덕스의 상태를 업데이트합니다.
    // 이 부분은 컴포넌트의 state 를 사용해도 상관없습니다.
    const { AuthActions } = this.props;
    AuthActions.changeInput({
      field: name,
      value,
    });
  };

  handleGoBack = () => {
    // 라우터의 history 를 사용하여 뒤로가기를 합니다.
    // 코드 최 하단에서 withRouter HOC 를 사용했기에 history 에 접근이 가능합니다.
    const { history } = this.props;
    history.goBack();
  };

  handleRegister = async () => {
    // 구현 예정
  };

  handleLogin = async () => {
    // 구현 예정
  };

  componentDidMount() {
    // 폼 정보를 초기화합니다.
    const { AuthActions } = this.props;
    AuthActions.initialize();
  }

  componentDidUpdate(prevProps, prevState) {
    // type 이 바뀔 때 폼 정보를 초기화 합니다.
    // (회원가입 <-> 로그인)
    if (prevProps.type !== this.props.type) {
      const { AuthActions } = this.props;
      AuthActions.initialize();
    }
  }

  render() {
    const { type, fields, error } = this.props;
    return (
      <AuthForm
        register={type === 'register'}
        onGoBack={this.handleGoBack}
        onChange={this.handleChange}
        onSubmit={type === 'register' ? this.handleRegister : this.handleLogin}
        fields={fields}
        error={error}
      />
    );
  }
}

// compose 를 사용하면 여러개의 HoC 를 깔끔하게 사용 할 수 있습니다.
const enhance = compose(
  withRouter,
  connect(
    ({ auth }) => ({ fields: auth.fields, error: auth.error }),
    dispatch => ({
      AuthActions: bindActionCreators(authActions, dispatch),
    })
  )
);

export default enhance(AuthFormContainer);
