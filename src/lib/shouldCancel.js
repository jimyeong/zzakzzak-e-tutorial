import { Component } from 'react';

// 서버사이드 렌더링 이후, 가장 첫 렌더링에서는 shouldCancel 이 true
// App 렌더링이 한번 마치고 나면, 그 다음부터는 false

let cancel = typeof window !== 'undefined' && !!window.__PRELOADED_STATE__; // 초기 상태가 있으면 true

// 현재의 cancel 값을 반환함
const shouldCancel = () => {
  return cancel; 
};

export class Rendered extends Component {
  // 컴포넌트 마운트 후 cancel 값을 false 로 설정해줌.
  componentDidMount() {
    cancel = false;
  }

  render() {
    return null;
  }
}

export default shouldCancel;