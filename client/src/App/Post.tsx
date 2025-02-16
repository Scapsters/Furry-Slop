import React, { useMemo } from 'react';
import { usePromise } from '../usePromise.tsx';
import { Tweet } from '../TweetQueue.tsx';
import './Post.css';

interface PostProps {
    tweet: Tweet | null,
    isTweetLoading: boolean
    skipPost: React.Dispatch<React.SetStateAction<void>>
}

export const Post: React.FC<PostProps> = ({ tweet, isTweetLoading, skipPost }) => {

    // wait for image urls to load
    const [urlsPromise, isUrlsPromiseLoading] = usePromise(tweet?.imageUrls, []);
    const urlsMemo = useMemo(() => Promise.all(urlsPromise), [urlsPromise]);
    const [urls, isUrlsLoading] = usePromise(urlsMemo, []);

    // wait for media url responses
    const [responsesPromise, isResponsesPromiseLoading] = usePromise(tweet?.mediaUrlResponses, []);
    const reponsesMemo = useMemo(() => Promise.all(responsesPromise), [responsesPromise]);
    const [responses, isResponsesLoading] = usePromise(reponsesMemo, []);
    
    if(isTweetLoading) {
        return <p>Loading tweet...</p>;
    }
    if(isResponsesPromiseLoading) {
        return <p>Loading media urls...</p>;
    }
    if(isResponsesLoading) {
        return <p>Loading media url responses...</p>;
    }
    if(isUrlsPromiseLoading) {
        return <p>Loading image urls...</p>;
    }
    if (isUrlsLoading) {
        return <p>Loading images...</p>;
    }
    
    if(tweet === null) {
        return <p>Current post null. Please refresh.</p>;
    }

    console.log(responses)
    if(responses.every(response => response.ok === false)) {
        console.log('skipost')
        skipPost();
    }


    const images = urls.map(url =>
        <img className='post' key={url} src={url} alt='loading'/>
    )

    return (
        <div className="posts">
            {images}
        </div>
    );
};