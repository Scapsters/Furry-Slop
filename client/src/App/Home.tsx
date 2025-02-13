import React from 'react';
import { Menu } from './Home/Menu.tsx';
import TweetData from '../../../interfaces/TweetData.ts';
import './Home.css';
import useAsync from '../UseAsync.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { emptyTweetData } from '../TweetData.tsx';

export const postContext = React.createContext<TweetData>(emptyTweetData);
export const refreshContext = React.createContext<() => void>(() => {});

export const Home = () => {

    const { tweetid } = useParams()
    const [tweetData] = useAsync(`Api/Tweets/${tweetid}`, emptyTweetData)

    const navigate = useNavigate()
    const useRefresh = React.useCallback(() => {
        navigate(`/`, { replace: true })
    }, [navigate])

    return (
        <postContext.Provider value={tweetData}>
        <refreshContext.Provider value={useRefresh}>
            <div className='home'>
                <img className='post' src={tweetData.media_urls || undefined} alt='slop'></img>
                <Menu/>
            </div>
        </refreshContext.Provider>
        </postContext.Provider>
    )
}