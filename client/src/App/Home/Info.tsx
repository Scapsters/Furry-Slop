import React from "react";
import "./Info.css";
import { Tweet } from "../../TweetQueue.tsx";
import { usePromise } from "../../usePromise.tsx";

interface InfoProps {
	tweet: Tweet | null;
}

export const Info: React.FC<InfoProps> = ({ tweet }) => {
	const [tweetData, isTweetDataLoading] = usePromise(
		tweet?.data ?? null,
		null
	);

	if (isTweetDataLoading) {
		return <p>Loading tweetData...</p>;
	}

	return (
		<div>
			<div>
				<div className="display">
					<span>{tweetData?.owner_display_name}</span>
					<a className="tweetLink" href={tweetData?.full_url}>
						View Post
					</a>
					<button className="pageLink" onClick={copyLinkToClipboard}>
						{" "}
						Copy Link{" "}
					</button>
				</div>

				<a href={`https://x.com/${tweetData?.owner_screen_name}`}>
					<span className="user">
						@{tweetData?.owner_screen_name}
					</span>
				</a>
			</div>
			<span className="body">
				{removeLink(tweetData?.tweet_text ?? "")}
			</span>
		</div>
	);
};

const copyLinkToClipboard = () => {
	navigator.clipboard.writeText(window.location.href);
};

const removeLink = (text: string) => {
	return text.substring(0, text.indexOf("http"));
};
