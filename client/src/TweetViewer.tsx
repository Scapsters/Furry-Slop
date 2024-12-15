import React from 'react';
import useAsync from './UseAsync.tsx';
import Tweet from './Tweet.tsx';
import TweetData from '../../interfaces/TweetData.ts';
import { useNavigate, useParams } from 'react-router-dom';

const TweetViewer = () => {

  const navigate = useNavigate()
  const { tweetid } = useParams()

  const serverPath = 
    tweetid === undefined ? 
      'RandomTweetData' : 
      `Tweets/${tweetid}`

  const [tweetData, isLoading] = useAsync(serverPath, createEmptyTweetData())

  if(isLoading || tweetData === undefined ) return <p> Loading... </p>
  if(tweetid === undefined) navigate(`/Tweets/${tweetData.status_id}`) // TODO: Seperate this into a different component

  return <div>
    <Tweet tweetData={tweetData}></Tweet>
  </div>
}

const createEmptyTweetData = (): TweetData => {
  return {
    status_id: '0',
    full_url: '',
    created_at: '',
    tweet_text: '',
    owner_screen_name: '',
    owner_display_name: '',
    favorite_count: 0,
    has_media: false,
    media_urls: '',
    media_details: [],
    error: undefined
  }
}

export default TweetViewer;
