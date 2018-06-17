import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
//changes
import { graphql } from 'react-apollo';

import NewsTitle from '../container/NewsTitleWithData';
import NewsDetail from '../container/NewsDetailWithData';
//changes
import meQuery from '../../data/queries/meQuery';

const NewsFeed = (props) => {
  const nextPage = Math.ceil((props.skip || 1) / props.first) + 1;

  const rows = [];
  if (props.notice) rows.push(...props.notice);
  props.newsItems.forEach((newsItem, index) => {
    if (!newsItem.hidden) {
      rows.push(
        <NewsTitle
          key={`${newsItem.id.toString()}title`}
          isRankVisible={props.isRankVisible}
          isUpvoteVisible={props.isUpvoteVisible}
          rank={props.skip + index + 1}
          {...newsItem}
        />,
      );
      rows.push(
        <NewsDetail
          key={`${newsItem.id.toString()}detail`}
          isFavoriteVisible={false}
          isPostScrutinyVisible={props.isPostScrutinyVisible}
          isJobListing={props.isJobListing}
          {...newsItem}
          //Passing allong current user info
          me={props.me}
        />,
      );
      rows.push(<tr className="spacer" key={`${newsItem.id.toString()}spacer`} style={{ height: 5 }} />);
    }
  });
  rows.push(<tr key="morespace" className="morespace" style={{ height: '10px' }} />);
  rows.push(
    <tr key="morelinktr">
      <td key="morelinkcolspan" colSpan="2" />
      <td key="morelinktd" className="title">
        <a key="morelink" href={`${props.currentURL}?p=${nextPage}`} className="morelink" rel="nofollow">More</a>
      </td>
    </tr>,
  );

  return (
    <tr>
      <td style={{ padding: '0px' }} >
        <table style={{ border: '0px', padding: '0px', borderCollapse: 'collapse', borderSpacing: '0px' }} className="itemlist">
          <tbody>
            { rows }
          </tbody>
        </table>
      </td>
    </tr>
  );
};
NewsFeed.defaultProps = {
  isPostScrutinyVisible: false,
  isJobListing: false,
  isRankVisible: true,
  isUpvoteVisible: true,
  notice: null,
};
NewsFeed.propTypes = {
  isPostScrutinyVisible: PropTypes.bool,
  first: PropTypes.number.isRequired,
  newsItems: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    commentCount: PropTypes.number.isRequired,
    creationTime: PropTypes.number.isRequired,
    hidden: PropTypes.bool.isRequired,
    submitterId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string,
    url: PropTypes.string,
    upvoteCount: PropTypes.number.isRequired,
  })).isRequired,
  notice: PropTypes.arrayOf(PropTypes.element),
  skip: PropTypes.number.isRequired,
  isJobListing: PropTypes.bool,
  isRankVisible: PropTypes.bool,
  isUpvoteVisible: PropTypes.bool,
  currentURL: PropTypes.string.isRequired,
  me: PropTypes.shape({
    id: PropTypes.string,
    karma: PropTypes.number,
  })
};
NewsFeed.fragments = {
  newsItem: gql`
    fragment NewsFeed on NewsItem {
      id
      hidden
      ...NewsTitle
      ...NewsDetail
    }
    ${NewsTitle.fragments.newsItem}
    ${NewsDetail.fragments.newsItem}
  `,
};
//Added the meQuery export
export default graphql(meQuery, {
  options: {
    // fetchPolicy: 'cache-and-network',
    // ssr: false,
  },
  props: ({ data: { me } }) => ({
    me,
  }),
})(NewsFeed);
