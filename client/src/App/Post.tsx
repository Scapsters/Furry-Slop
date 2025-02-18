import React, { useMemo } from "react";
import { usePromise } from "../usePromise.tsx";
import { Tweet } from "../TweetQueue.tsx";
import "./Post.css";
import { emptyTweetData } from "../TweetData.tsx";
import { MediaDetails } from "../../../interfaces/TweetData.ts";

interface PostProps {
	tweet: Tweet | null;
	isTweetLoading: boolean;
    nextTweet: Tweet | null;
    isNextTweetLoading: boolean;
	skipPost: React.Dispatch<React.SetStateAction<void>>;
}

export const Post: React.FC<PostProps> = ({
	tweet,
	isTweetLoading,
    nextTweet,
    isNextTweetLoading,
	skipPost,
}) => {

    /*
     * Wait for information about the first post
     */

	// wait for image urls to load
	const [urlsPromise, isUrlsPromiseLoading] = usePromise(
		tweet?.imageUrls,
		[]
	);
	const urlsMemo = useMemo(() => Promise.all(urlsPromise), [urlsPromise]);
	const [urls, isUrlsLoading] = usePromise(urlsMemo, []);

	// wait for tweet data
	const [tweetData, isTweetDataLoading] = usePromise(
		tweet?.data,
		emptyTweetData
	);

    /*
     * Wait for information about the next post,
     */

    // wait for image urls to load
    const [nextUrlsPromise, isNextUrlsPromiseLoading] = usePromise(
        nextTweet?.imageUrls,
        []
    );
    const nextUrlsMemo = useMemo(() => Promise.all(nextUrlsPromise), [nextUrlsPromise]);
    const [nextUrls, isNextUrlsLoading] = usePromise(nextUrlsMemo, []);

    // wait for tweet data
    const [nextTweetData, isNextTweetDataLoading] = usePromise(
        nextTweet?.data,
        emptyTweetData
    );

    // If anything is loading, display a loading message. This should only slow loading the first post.
	if (
		isTweetLoading ||
		isUrlsPromiseLoading ||
		isUrlsLoading ||
		isTweetDataLoading ||
        isNextTweetLoading ||
        isNextUrlsPromiseLoading ||
        isNextUrlsLoading ||
        isNextTweetDataLoading
	) {
		return <p>Loading tweet data...</p>;
	}

	if (tweet === null) {
		return <p>Current post null. Please refresh.</p>;
	}

    // TODO: mediaDeatils and urls are sometimes different lengths which doesnt make sense but this sorts it out fine
    const createImages = (mediaTypes: string[], mediaDetails: MediaDetails[] = []) => {
        return mediaDetails.map((details, index) => {
            
            const key = details.url;
            if (mediaTypes[index] === "image") {
                return (
                    <img
                        key={key}
                        className="post"
                        src={key || undefined}
                        alt="No post retrieved. Either Twitter's CDN didn't work, the artist limited post visibility, or there is no media. Check the post."
                    ></img>
                );
            } else {
                return (
                    <video key={key} className="post" controls autoPlay loop muted>
                        <source src={key || undefined} type="video/mp4"></source>
                        Your browser does not support the video tag.
                    </video>
                );
            }
        });
    }

    
	const mediaTypes = tweetData.media_details?.map((detail) => detail.type);
    const images = mediaTypes === undefined || urls.length === 0 
        ? <p>No media in post.</p>
        : createImages(mediaTypes, tweetData.media_details);

    const nextMediaTypes = nextTweetData.media_details?.map((detail) => detail.type);
    const nextImages = nextMediaTypes === undefined || nextUrls.length === 0 
        ? <p>No media in post.</p>
        : createImages(nextMediaTypes, nextTweetData.media_details);

        
	return <>
        <div className="posts">{images}</div>
        <div className="posts hiddenPost">{nextImages}</div>
    </>
};
