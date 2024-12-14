import React from 'react';
import useAsync from './UseAsync.tsx';
import ImageBundle from './Image.tsx';
import TweetData from '../../interfaces/TweetData';

const awaitTweetData = async (): Promise<TweetData> => {
  const response = await fetch("http://localhost:5000/RandomTweetData")
  if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  return await response.json()
}

const App = () => {

  const [tweetData, isLoading] = useAsync(awaitTweetData, {
    status_id: 0,
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
  })

  if(isLoading || tweetData === undefined ) return <p> Loading... </p>
  console.log(tweetData)
  console.log('hi')

  return <div>
    <ImageBundle tweetData={tweetData[0]}></ImageBundle>
  </div>
}

export default App;
