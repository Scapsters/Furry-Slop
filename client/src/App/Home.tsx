import React from "react";
import { Menu } from "./Home/Menu.tsx";
import TweetData from "../../../interfaces/TweetData.ts";
import "./Home.css";
import useAsync from "../UseAsync.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { emptyTweetData } from "../TweetData.tsx";

export const postContext = React.createContext<TweetData>(emptyTweetData);
export const refreshContext = React.createContext<() => void>(() => {});

export const Home = () => {
	const { tweetid } = useParams();
	const [tweetData] = useAsync(`Api/Tweets/${tweetid}`, emptyTweetData);

	const navigate = useNavigate();
	const useRefresh = React.useCallback(() => {
		navigate(`/`);
	}, [navigate]);

	const mediaUrls = tweetData.media_urls?.split(",");
	const mediaTypes = tweetData.media_details?.map((media) => media.type);

	console.log(mediaUrls);
	console.log(mediaTypes);

	let images;
	if (mediaUrls === undefined || mediaTypes === undefined)
		images = <p> "No media in post" </p>;
	else if (tweetData.status_id === "0") {
		images = <p> invalid ID. please refresh. </p>;
	} else {
		images = mediaUrls.map((url, index) => {
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
	}

	return (
		<postContext.Provider value={tweetData}>
			<refreshContext.Provider value={useRefresh}>
				<div className="home">
					<div className="posts" onClick={useRefresh}>{images}</div>
					<Menu />
				</div>
			</refreshContext.Provider>
		</postContext.Provider>
	);
};
