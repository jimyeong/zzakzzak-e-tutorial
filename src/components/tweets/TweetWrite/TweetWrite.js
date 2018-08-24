import React, { Component } from 'react';
import './TweetWrite.scss';

class TweetWrite extends Component {
  textareaRef = React.createRef();

  handleButtonClick = () => {
    this.textareaRef.current.focus();
    this.props.onWrite();
  };

  handleKeyUp = e => {
    if (e.ctrlKey && e.keyCode === 13) {
      this.handleButtonClick();
    }
  };

  render() {
    const {
      fields, // input, textarea 값들
      logged, // 로그인 유무
      onChange, // 인풋 변경 이벤트
    } = this.props;
    const { name, password, text } = fields;

    return (
      <div className="TweetWrite">
        <textarea
          ref={this.textareaRef}
          value={text}
          onChange={onChange}
          onKeyUp={this.handleKeyUp}
          name="text"
          placeholder="무슨 생각을 하고 계신가요?"
        />
        <div className="wrapper">
          {!logged && ( // 로그인 여부에 따라 익명 작성 관련 UI
            <div className="inputs">
              <input
                value={name}
                onChange={onChange}
                name="name"
                placeholder="이름"
              />
              <input
                value={password}
                onChange={onChange}
                name="password"
                type="password"
                placeholder="비밀번호"
              />
            </div>
          )}
          <button
            disabled={text === '' || (!logged && password.length < 6)} // 익명 & 비밀번호 짧거나, 혹은 텍스트가 비어있거나
            onClick={this.handleButtonClick}
          >
            작성
          </button>
        </div>
      </div>
    );
  }
}

export default TweetWrite;
