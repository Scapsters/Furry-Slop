import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAsync from '../UseAsync.tsx';
import { emptyTweetData } from '../TweetData.tsx';

export const RandomTweet = () => {
    const navigate = useNavigate()
    const [tweetData, isLoading] = useAsync('Api/RandomTweetData', emptyTweetData)
    useEffect(() => {
        if(!isLoading) navigate(`Tweets/${tweetData.status_id}`, { replace: true })
    }, [navigate, tweetData.status_id, isLoading])

    return null
}