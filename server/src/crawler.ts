import { Request, Response } from "express";
import type { TweetDataResponse } from "../../Interfaces/TweetData.ts";
import { queryPostForTweetID } from "./db/tweets/db_tweets.ts";

export const isCrawler = (userAgent: string): boolean => {
	const crawlers: string[] = [
		"googlebot",
		"bingbot",
		"yandex",
		"baiduspider",
		"discordbot",
		"facebookexternalhit",
	];
	return crawlers.some((crawler) =>
		userAgent.toLowerCase().includes(crawler)
	);
};

export const TweetsForScrapers = async (
	req: Request,
	res: Response,
	next: () => void
) => {
	if (req.headers["user-agent"] && isCrawler(req.headers["user-agent"])) {
		console.log("Crawler detected:", req.headers["user-agent"]);
		const tweetData: TweetDataResponse = await queryPostForTweetID(
			req.params.tweetid
		);

		const mediaUrl: string =
			tweetData.media_urls === undefined || tweetData.media_urls === ""
				? "https://furryslop.com/logo192.png"
				: tweetData.media_urls.split(", ")[0];

		res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>${tweetData.owner_screen_name}</title>
                <meta name="twitter:site" content="@${tweetData.owner_screen_name}">
                <meta name="twitter:title" content="${tweetData.owner_screen_name}">
                <meta name="twitter:description" content="${tweetData.tweet_text_content}">
                <meta name="twitter:card" content="summary_large_image">
                <meta name="twitter:image:src" content="${mediaUrl}">
            </head>
            <body>
                <div id="root"></div>
            </body>
            </html>
        `);
	} else {
		next();
	}
};
