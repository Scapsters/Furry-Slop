import React from "react";
import "./Info.css";
import { Tweet } from "../../TweetQueue.tsx";
import { emptyTweetData } from "../../TweetData.tsx";
import { usePromise } from "../../usePromise.tsx";

interface InfoProps {
	tweet: Tweet | null
	isTweetLoading: boolean
}

export const Info: React.FC<InfoProps> = ({ tweet, isTweetLoading }) => {
	
	const removeLink = (text) => {
		return text.substring(0, text.indexOf("http"));
	};
    const copyLinkToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
    }

	const [tweetData, isTweetDataLoading] = usePromise(tweet?.data, emptyTweetData);

	if(isTweetLoading) {
		return <p>Loading tweet...</p>;
	}
	if(isTweetDataLoading) {
		return <p>Loading tweetData...</p>;
	}
	console.log()
	console.log(isTweetLoading)
	console.log(tweet)

	return (
		<div>
			<div>
				<div className="display">
					<span>{tweetData.owner_display_name}</span>
					<a className="tweetLink" href={tweetData.full_url}>
						View Post
					</a>
					<button className="pageLink" onClick={copyLinkToClipboard}> Copy Link </button>
				</div>

                <a href={`https://x.com/${tweetData.owner_screen_name}`}>
                    <span className="user">@{tweetData.owner_screen_name}</span>
                </a>
			</div>
			<span className="body">{removeLink(tweetData.tweet_text)}</span>
		</div>
	)
};
