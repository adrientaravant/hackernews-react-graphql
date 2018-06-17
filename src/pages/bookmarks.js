import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Main from '../layouts/Main';
import NewsFeed from '../components/presentational/NewsFeed';
import withData from '../helpers/withData';
import data from '../data/SampleData';
import meQuery from '../data/queries/meQuery';

// TODO
 export default withData(props => {
  return (
  <Main currentURL={props.url.pathname}>
    <NewsFeed
      newsItems={[]}
    />
  </Main>
  )
});


