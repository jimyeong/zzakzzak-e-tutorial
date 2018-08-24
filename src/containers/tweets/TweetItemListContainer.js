import React, { Component, Fragment } from 'react';
import TweetItemList from 'components/tweets/TweetItemList';
import * as tweetActions from 'store/modules/tweets';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import Loading from 'components/common/Loading';

class TweetItemListContainer extends Component {
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

  render() {
    // * loading 값을 확인해서 조건부로  Loading 컴포넌트 보여주기
    const { list, username, loading } = this.props;

    if (loading) return <Loading />; // * 추가됨

    return (
      <Fragment>
        <TweetItemList
          tweets={list}
          onRemove={this.handleOpenRemoveModal}
          currentUser={username}
        />
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
      loading: pender.pending['tweets/GET_INITIAL'], // * GET_INITIAL 요청 상태
    }),
    dispatch => ({
      TweetActions: bindActionCreators(tweetActions, dispatch),
    })
  )
);
export default enhance(TweetItemListContainer);
