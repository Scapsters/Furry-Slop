import React from 'react';
import useAsync from './UseAsync.tsx';
import Tweet from './Tweet.tsx';
import TweetData from '../../../interfaces/TweetData.ts';
import { useNavigate, useParams } from 'react-router-dom';
import './TweetViewer.css'

const TweetViewer = () => {

  const navigate = useNavigate()
  const { tweetid } = useParams()

  console.log(tweetid)
  const [tweetData, isLoading] = useAsync(`Api/Tweets/${tweetid}`, createEmptyTweetData())

  console.log(tweetData)
  if(isLoading) return <p> Loading... </p>

  return <div className="tweetViewer">
    <button className="random" onClick={() => navigate('/')} > Refresh </button>
    <Tweet tweetData={tweetData}></Tweet>
  </div>
}

// This is copied from the server
export const createEmptyTweetData = (): TweetData => {
  return {
    status_id: '0',
    full_url: '',
    created_at: '',
    tweet_text: '',
    tweet_text_content: '',
    tweet_text_link: '',
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
