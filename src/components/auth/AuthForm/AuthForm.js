import React, { Component } from 'react';
import Button from 'components/common/Button';

import './AuthForm.scss';

class AuthForm extends Component {
  // fields 가 없을 때 튕기지 않도록 defaultProps 설정
  static defaultProps = {
    fields: {
      username: '',
      password: '',
      passwordConfirm: '',
    },
  };
  handleKeyPress = e => {
    // 엔터 입력시 props 로 전달받은 onSubmit 함수 호출
    if (e.key === 'Enter') {
      this.props.onSubmit();
    }
  };
  render() {
    const {
      register, // 회원가입 모드 일 시 true
      fields, // 폼 인풋 값들이 들어있는 객체
      onGoBack, // 뒤로가는 함수
      onChange, // 인풋 change 이벤트 핸들러
      onSubmit, // 로그인 혹은 회원가입 이벤트
      error, // 에러 발생 시 받아올 텍스트
    } = this.props;
    const { username, password, passwordConfirm } = fields;
    return (
      <div className="AuthForm">
        {error && <div className="error">{error}</div>}
        <div className="inputs">
          <input
            name="username"
            placeholder="계정명"
            onChange={onChange}
            value={username}
          />
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            onChange={onChange}
            value={password}
            onKeyPress={this.handleKeyPress}
          />
          {register && (
            <input
              name="passwordConfirm"
              type="password"
              placeholder="비밀번호 다시입력"
              onChange={onChange}
              value={passwordConfirm}
              onKeyPress={this.handleKeyPress}
            />
          )}
        </div>
        <div className="buttons">
          <Button onClick={onGoBack}>뒤로</Button>
          <Button
            className="full-width"
            active
            onClick={onSubmit}
            type="submit"
          >
            {register ? '회원가입' : '로그인'}
          </Button>
        </div>
      </div>
    );
  }
}

export default AuthForm;
