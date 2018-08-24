import React, { Component, Fragment } from 'react';
import TweetItemList from 'components/tweets/TweetItemList';
import * as tweetActions from 'store/modules/tweets';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import Loading from 'components/common/Loading';
import throttle from 'lodash/throttle'; // * throttle 로 요청횟수 제한

// * 스크롤 관련 함수 작성

// 현재 스크롤 위치를 가져옵니다.
// 브라우저마다 스펙이 다르기에 documentElement 유무에 따라 scrollTop 을 어디서 읽어야 할 지 다름
const getScrollTop = () => {
  if (!document.body) return 0;
  const scrollTop = document.documentElement
    ? document.documentElement.scrollTop
    : document.body.scrollTop;
  return scrollTop;
};

// 현재 브라우저 크기와 스크롤 위치를 계산하여 맨 아래에서 얼마나 떨어졌는지 확인
const getScrollBottom = () => {
  if (!document.body) return 0;
  const { scrollHeight } = document.body;
  const { innerHeight } = window;
  const scrollTop = getScrollTop();
  return scrollHeight - innerHeight - scrollTop;
};

class TweetItemListContainer extends Component {
  lastCursor = null; // 가장 최근 추가로딩한 아이디; 중복 로딩을 방지합니다.

  initialize = async () => {
    // 현재 선택된 태그, 유저명에 따라 초기 요청을 넣어줍니다.
    // didMount 와 didUpdate 에서 호출됩니다.
    const {
      TweetActions,
      match: { params },
    } = this.props;
    const { tag, username } = params;
    try {
      await TweetActions.getInitial({
        username,
        tag,
      });
    } catch (e) {}
  };

  componentDidMount() {
    this.initialize();
    // * 스크롤 이벤트 등록
    window.addEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate(prevProps, prevState) {
    // 특정 조건이 바뀌었는지 검사를 합니다
    if (
      this.props.match.params.username !== prevProps.match.params.username ||
      this.props.match.params.tag !== prevProps.match.params.tag
    ) {
      // 그래서 유저명이나 태그 바뀌면 재요청
      // 리액트 라우터에서 주소에 따라 다른걸 불러와야하면 이렇게
      // cdu 에서 작업 하시면 됩니다.
      this.initialize();
    }
  }

  componentWillUnmount() {
    // 언마운트시 스크롤 이벤트 제거
    window.addEventListener('scroll', this.handleScroll);
  }

  // throttle 을 통하여 1초에 최소 4번만 이 함수가 발생하게끔 제한 시킬수있음.
  handleScroll = throttle(() => {
    const scrollBottom = getScrollBottom();
    if (scrollBottom < 350) {
      this.getNext();
    }
  }, 250);

  // 다음 짹짹이들을 불러오는 함수
  getNext = () => {
    const { TweetActions, lastId, loadingNext, end } = this.props;
    // 이미 진행중이거나, 더이상 불러올게 없거나, 이미 요청한 id 면 아무것도 안함
    if (loadingNext || end || this.lastCursor === lastId) return;
    TweetActions.getNext({ cursor: lastId });
    this.lastCursor = lastId; // 중복 요청을 막기 위해서 값 넣어두기
  };

  render() {
    // * loadingNext 가 true 면 아랫부분에 Loading 컴포넌트 보여주기
    const { list, username, loading, loadingNext } = this.props;

    if (loading) return <Loading />;

    return (
      <Fragment>
        <TweetItemList
          tweets={list}
          onRemove={this.handleOpenRemoveModal}
          currentUser={username}
        />
        {loadingNext && <Loading />}
      </Fragment>
    );
  }
}

const enhance = compose(
  withRouter,
  connect(
    ({ tweets, user, pender }) => ({
      list: tweets.list,
      end: tweets.end,
      username: user.user && user.user.username,
      loading: pender.pending['tweets/GET_INITIAL'],
      // * 현재 짹짹이의 가장 마지막 _id 값과, 추가로딩상태를 받아옴
      lastId:
        tweets.list &&
        tweets.list[tweets.list.length - 1] &&
        tweets.list[tweets.list.length - 1]._id,
      loadingNext: pender.pending['tweets/GET_NEXT'],
    }),
    dispatch => ({
      TweetActions: bindActionCreators(tweetActions, dispatch),
    })
  )
);
export default enhance(TweetItemListContainer);
