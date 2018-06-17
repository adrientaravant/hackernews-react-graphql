import React, { Component } from 'react';
import gql from 'graphql-tag';
import Link from 'next/link';
import PropTypes from 'prop-types';
import url from 'url';


import convertNumberToTimeAgo from '../../helpers/convertNumberToTimeAgo';

export default class NewsDetail extends Component {
  // Constructor method to initiate the "bookmarked" state
  constructor(props) {
    super(props);
    this.state = {
      bookmarked: false,
    }
  }
  componentDidMount() {
      this.hydrateStateWithLocalStorage();
   }
  //Method to hydrate state component to localStorage
  hydrateStateWithLocalStorage() {
    //Handle case when user is not logged in
    let userId = "guest"
    if(this.props.me) {
      userId = this.props.me.id;
    }
    if (localStorage.hasOwnProperty(userId)) {
      // get the key's value from localStorage
      const userBookmarks = JSON.parse(localStorage.getItem(userId)) || [];
      //Look if the post has been bookmarked and set the state accordingly
      const indexItemBookmarked = userBookmarks.findIndex((postItem,i) => postItem.id == this.props.id);
      indexItemBookmarked !== -1 ? this.setState({ bookmarked: true }) : this.setState({ bookmarked: false });
    }
  }
  //Method to save bookmarks to localStorage and update the bookmark button text
  saveStateToLocalStorage = () => {
      //Handle case when user is not logged in
      let userId = "guest"
      if(this.props.me) {
        userId = this.props.me.id;
      }
      //get the bookmarks for current user from localStorage
      const userBookmarks = JSON.parse(localStorage.getItem(userId)) || [];
      //Look for the postItem element index inside the current user bookmarks
      const indexItemBookmarked = userBookmarks.findIndex((postItem,i) => postItem.id == this.props.id);
      //Update state and localStorage depending on actual localStorage and bookmark state
      if (!this.state.bookmarked) {
        if(indexItemBookmarked == -1) {
          //save the bookmark
          userBookmarks.push(this.props);
          localStorage.setItem(userId,JSON.stringify(userBookmarks));
        }
      } else {
        if(indexItemBookmarked !== -1) {
          //remove the bookmark
          userBookmarks.splice(indexItemBookmarked, 1);
          localStorage.setItem(userId,JSON.stringify(userBookmarks));
        }
      }
      //change component bookmarked state
      this.setState({ bookmarked: !this.state.bookmarked });
    }

  // Added the me props to retrieve logged in user informations
  static propTypes = {
    id: PropTypes.number.isRequired,
    commentCount: PropTypes.number.isRequired,
    creationTime: PropTypes.number.isRequired,
    hidden: PropTypes.bool.isRequired,
    hideNewsItem: PropTypes.func.isRequired,
    isPostScrutinyVisible: PropTypes.bool,
    isFavoriteVisible: PropTypes.bool,
    isJobListing: PropTypes.bool,
    submitterId: PropTypes.string.isRequired,
    upvoteCount: PropTypes.number.isRequired,
    me: PropTypes.shape({
      id: PropTypes.string,
      karma: PropTypes.number,
    })
  }
  static defaultProps = {
    isFavoriteVisible: true,
    isPostScrutinyVisible: false,
    isJobListing: false,
    me: null,
  }
  static fragments = {
    newsItem: gql`
      fragment NewsDetail on NewsItem {
        id
        commentCount
        creationTime
        hidden
        submitterId
        upvoteCount
      }
    `,
  };
  render() {
    return (
      this.props.isJobListing ?
        <tr>
          <td colSpan="2" />
          <td className="subtext">
            <span className="age">
              <Link prefetch href={`/item?id=${this.props.id}`}>
                <a>
                  {convertNumberToTimeAgo(this.props.creationTime)}
                </a>
              </Link>
            </span>
          </td>
        </tr>
        :
        <tr>
          <td colSpan="2" />
          <td className="subtext">
            <span className="score">{this.props.upvoteCount} points</span>
            {' by '}
            <Link prefetch href={`/user?id=${this.props.submitterId}`}>
              <a className="hnuser">
                {this.props.submitterId}
              </a>
            </Link>
            {' '}
            <span className="age">
              <Link prefetch href={`/item?id=${this.props.id}`}>
                <a>
                  {convertNumberToTimeAgo(this.props.creationTime)}
                </a>
              </Link>
            </span>
            {' | '}
            {
              this.props.hidden ?
                <a href="javascript:void(0)" onClick={() => this.props.hideNewsItem(this.props.id)}>
                  hide
                </a>
                :
                <a href="javascript:void(0)" onClick={() => this.props.unhideNewsItem(this.props.id)}>
                  hide
                </a>
            }
            {
              this.props.isPostScrutinyVisible &&
              <span>
                {' | '}
                <a href="https://hn.algolia.com/?query=Sublime%20Text%203.0&sort=byDate&dateRange=all&type=story&storyText=false&prefix&page=0">
                past
                </a>
                {' | '}
                <a href="https://www.google.com/search?q=Sublime%20Text%203.0">
                web
                </a>
              </span>
            }
            {' | '}
            {
                <a href="javascript:void(0)" onClick={this.saveStateToLocalStorage}>
                  {(() => {
                    switch (this.state.bookmarked) {
                      case true: return 'unbookmark';
                      case false: return 'bookmark';
                      default: return 'bookmark';
                    }
                  })()}
                </a>
            }
            {' | '}
            <Link prefetch href={`/item?id=${this.props.id}`}>
              <a>
                {(() => {
                  switch (this.props.commentCount) {
                    case 0: return 'discuss';
                    case 1: return '1 comment';
                    default: return `${this.props.commentCount} comments`;
                  }
                })()}
              </a>
            </Link>
            {this.props.isFavoriteVisible && ' | favorite'}
          </td>
        </tr>
    );
  }
}
