import React from 'react';
import TweetsTemplate from 'components/tweets/TweetsTemplate';
import TweetWriteContainer from 'containers/tweets/TweetWriteContainer';
import TweetItemListContainer from 'containers/tweets/TweetItemListContainer';

const TweetsPage = ({ match }) => {
  return (
    <TweetsTemplate>
      {match.path === '/' && <TweetWriteContainer />}
      <TweetItemListContainer />
    </TweetsTemplate>
  );
};

export default TweetsPage;
