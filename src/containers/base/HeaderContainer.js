import React, { Component } from 'react';

import { connect } from 'react-redux';
import Header from 'components/base/Header';

class HeaderContainer extends Component {
  render() {
    if (!this.props.visible) return null; // visible 값이 false 일 때에는 숨기기
    return <Header right="오른쪽" />;
  }
}

export default connect(({ base }) => ({ visible: base.visible }))(HeaderContainer);
