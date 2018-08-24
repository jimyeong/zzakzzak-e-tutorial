import React, { Component } from 'react';
import TweetWrite from 'components/tweets/TweetWrite';
import { connect } from 'react-redux';
import { changeInput, writeTweet } from 'store/modules/write';

class TweetWriteContainer extends Component {
  handleChange = e => {
    // 인풋 값 변경하기
    const { changeInput } = this.props;
    const { name, value } = e.target;
    changeInput({
      field: name,
      value,
    });
  };

  handleWrite = async () => {
    // 짹짹이 작성하기 함수
    const { fields, changeInput, writeTweet } = this.props;
    const { name, password, text } = fields;
    if (!text) return;
    try {
      changeInput({
        field: 'text',
        value: '',
      });
      await writeTweet({
        name: name || '이름없음', // 기본값
        pass: password,
        text,
      });
      // 추후 신규 짹짹이 로딩 구현
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { fields, user } = this.props;
    return (
      <TweetWrite
        onChange={this.handleChange}
        fields={fields}
        onWrite={this.handleWrite}
        logged={!!user}
      />
    );
  }
}

export default connect(
  ({ write, tweets, user }) => ({
    fields: write.fields,
    user: user.user,
  }),
  {
    changeInput,
    writeTweet,
  }
)(TweetWriteContainer);
