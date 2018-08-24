import React from 'react';
import TweetsTemplate from 'components/tweets/TweetsTemplate';
import TweetWriteContainer from 'containers/tweets/TweetWriteContainer';

const TweetsPage = ({ match }) => {
  return (
    <TweetsTemplate>
      {match.path === '/' && <TweetWriteContainer />}
    </TweetsTemplate>
  );
};

export default TweetsPage;
