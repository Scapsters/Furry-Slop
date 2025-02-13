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

    console.log(mediaUrls)
    console.log(mediaTypes)

	const images =
		mediaUrls === undefined || mediaTypes === undefined ? (
			<p> "No media in post" </p>
		) : (
			mediaUrls.map((url, index) => {
				if (mediaTypes[index] === "image") {
					return (
						<img
							key={url}
							className="post"
							src={url || undefined}
							alt="No post retrieved. This is likely because the artist has privated their account or limited tweet access. There maybe was no media in the tweet."
						></img>
					);
				} else {
					return (
						<video
							key={url}
							className="post"
                            controls autoPlay muted
						>
                            <source src={url || undefined} type="video/mp4"></source>
                            Your browser does not support the video tag.
                        </video>
					);
				}
			})
		);

	return (
		<postContext.Provider value={tweetData}>
			<refreshContext.Provider value={useRefresh}>
				<div className="home">
					<div className="posts">{images}</div>
					<Menu />
				</div>
			</refreshContext.Provider>
		</postContext.Provider>
	);
};
