import React from "react";
import "./Info.css";

export const Info = ({ tweetData }) => {
	const removeLink = (text) => {
		return text.substring(0, text.indexOf("http"));
	};
    const copyLinkToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
    }
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
	);
};
