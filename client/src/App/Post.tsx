import React from 'react';

export const Post = ({ tweetData, refresh }) => {

    const mediaUrls = tweetData.media_urls?.split(",");
	const mediaTypes = tweetData.media_details?.map((media) => media.type);

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

    return <div className="posts" onClick={refresh}>{images}</div>
}