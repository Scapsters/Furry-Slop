import React, { useContext } from "react";
import "./Info.css";

import { postContext } from "../../Home.tsx";

export const Info = () => {
	const postInfo = useContext(postContext);
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
					<span>{postInfo.owner_display_name}</span>
					<a className="tweetLink" href={postInfo.full_url}>
						View Post
					</a>
					<button className="pageLink" onClick={copyLinkToClipboard}> Copy Link </button>
				</div>

                <a href={`https://x.com/${postInfo.owner_screen_name}`}>
                    <span className="user">@{postInfo.owner_screen_name}</span>
                </a>
			</div>
			<span className="body">{removeLink(postInfo.tweet_text)}</span>
		</div>
	);
};
