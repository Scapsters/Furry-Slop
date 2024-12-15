import React from 'react';
import useAsync from './UseAsync.tsx';
import Tweet from './Tweet.tsx';
import TweetData from '../../interfaces/TweetData.ts';
import { useNavigate, useParams } from 'react-router-dom';

const TweetViewer = () => {

  const navigate = useNavigate()
  const { tweetid } = useParams()

  console.log(tweetid)
  const [tweetData, isLoading] = useAsync(`Tweets/${tweetid}`, createEmptyTweetData())

  console.log(tweetData)
  if(isLoading) return <p> Loading... </p>

  return <div>
    <Tweet tweetData={tweetData}></Tweet>
    <button onClick={() => navigate('/')} > Random </button>
  </div>
}

export const createEmptyTweetData = (): TweetData => {
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