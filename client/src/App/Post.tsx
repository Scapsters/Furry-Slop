import React, { useMemo } from "react";
import { usePromise } from "../usePromise.tsx";
import { Tweet } from "../TweetQueue.tsx";
import "./Post.css";
import { MediaDetails } from "../../../Interfaces/TweetData.ts";

export const Post: React.FC<PostProps> = ({
	tweet,
	nextTweet,
	skipPost,
}) => {
	
	const [images, areUrlsLoading, isTweetDataLoading] = useImage(tweet);
	const nextImages = useImage(nextTweet);

	if (areUrlsLoading || isTweetDataLoading) {
		const urlLoadingMessage = areUrlsLoading ? "Waiting for Twitter's CDN" : ""
		const tweetDataLoadingMessage = isTweetDataLoading ? "Waiting for furryslop server" : ""
		return <>
			<p>{urlLoadingMessage}</p>
			<p>{tweetDataLoadingMessage}</p>
		</>
	}

	if(!images) {
		return <p>Waiting for images...</p>
	}

	return (
		<>
			<div className="posts" onClick={() => skipPost()}>{images}</div>
			<div className="posts hiddenPost">{nextImages}</div>
		</>
	);
};

// mediaDetails and urls are sometimes different lengths which doesnt make sense but this sorts it out fine
const createImages = (
	mediaTypes: string[],
	mediaDetails: MediaDetails[] = []
) => {
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
};

const useImage = (tweet: Tweet | null) => {
	// Gather media urls and fetch the images from twitter. Urls don't need to be passed to images since this caches them in the browser.
	const [urlsPromise] = usePromise(tweet?.imageUrls ?? null, []);
	const urlsMemo = useMemo(
		() => (urlsPromise ? Promise.all(urlsPromise) : null),
		[urlsPromise]
	);
	const [urls, areUrlsLoading] = usePromise(urlsMemo, []);

	// Gat tweet data and then construct a set of images
	const [tweetData, isTweetDataLoading] = usePromise(tweet?.data ?? null, null);

	const mediaTypes = tweetData?.media_details?.map((detail) => detail.type);
	const images =
		mediaTypes === undefined || urls?.length === 0 ? (
			false
		) : (
			createImages(mediaTypes, tweetData?.media_details)
		);

	return [images, areUrlsLoading, isTweetDataLoading];
};
interface PostProps {
	tweet: Tweet | null;
	nextTweet: Tweet | null;
	skipPost: React.Dispatch<React.SetStateAction<void>>;
}
