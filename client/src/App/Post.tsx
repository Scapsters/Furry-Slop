import React, { useMemo } from 'react';
import { usePromise } from '../usePromise.tsx';
import { Tweet } from '../TweetQueue.tsx';
import './Post.css';
import { emptyTweetData } from '../TweetData.tsx';

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

    // wait for tweet data
    const [tweetData, isTweetDataLoading] = usePromise(tweet?.data, emptyTweetData);
    
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
    if(isTweetDataLoading) {
        return <p>Loading tweet data...</p>;
    }
    
    if(tweet === null) {
        return <p>Current post null. Please refresh.</p>;
    }

    console.log(responses)
    if(responses.every(response => response.ok === false)) {
        console.log('skipost')
        skipPost();
    }


    const mediaTypes = tweetData.media_details?.map(detail => detail.type);
    if(mediaTypes === undefined || urls.length === 0) {
        return <p>No media in post.</p>;
    }
    console.log(tweetData)
    console.log(mediaTypes)
    console.log(urls)

    const images = urls.map((url, index) => {
        if (mediaTypes[index] === "image") {
            return (
                <img
                    key={url}
                    className="post"
                    src={url || undefined}
                    alt="No post retrieved. Either Twitter's CDN didn't work, the artist limited post visibility, or there is no media. Check the post."
                ></img>
            );
        } else {
            return (
                <video
                    key={url}
                    className="post"
                    controls
                    autoPlay
                    loop
                    muted
                >
                    <source
                        src={url || undefined}
                        type="video/mp4"
                    ></source>
                    Your browser does not support the video tag.
                </video>
            );
        }
    });

    return (
        <div className="posts">
            {images}
        </div>
    );
};