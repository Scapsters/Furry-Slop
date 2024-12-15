import { useEffect } from "react";
import useAsync from "./UseAsync.tsx";
import { createEmptyTweetData } from "./TweetViewer.tsx";
import { useNavigate } from 'react-router-dom';

export const RandomImage = () => {
    const [tweetData, isLoading] = useAsync('RandomTweetData', createEmptyTweetData())
    const navigate = useNavigate()

    useEffect(() => {
        if(!isLoading) navigate(`/Tweets/${tweetData.status_id}`, { replace: true })
    }, [navigate, tweetData.status_id, isLoading])
    
    return null
}

export default RandomImage
