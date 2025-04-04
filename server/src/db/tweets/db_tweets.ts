import TweetData from "../../../../Interfaces/TweetData.ts";
import { sqlToTweetData } from "../../../TweetData.ts";
import sql from "../db.ts";
import { sanitized_tweet_ids } from "../sanitized_tweets.ts";
import { createEmptyTweetData } from "./tweet_processing.ts";

export const queryPostForTweetID = async (
	tweetID: string
): Promise<TweetData> => {
	const response = await sql`
		SELECT * FROM posts WHERE status_id = ${tweetID};
	`;

	if (!validateResponse(response)) {
		return createEmptyTweetData();
	}

	const tweetData = response[0];
	return sqlToTweetData(tweetData);
};

export async function queryRandomPost(sanitized: boolean): Promise<TweetData> {
	
	if (sanitized) {
		const status_id =
			sanitized_tweet_ids[
				Math.floor(Math.random() * sanitized_tweet_ids.length)
			];
		return queryPostForTweetID(status_id);
	}

	const numberOfImages = (await sql`SELECT COUNT(*) FROM posts;`)[0];
	const id = String(Math.floor(Math.random() * numberOfImages.count) + 1);

	console.log("Querying post with id: " + id);
	const response = await sql`
		SELECT * FROM posts WHERE id = ${id};
	`;
	if (!validateResponse(response)) {
		return createEmptyTweetData();
	}

	const tweetData = response[0];
	return sqlToTweetData(tweetData);
}

export const validateResponse = (response: any): boolean => {
	if (response === undefined) {
		console.error("Response is undefined.");
		return false;
	}
	if (response.length === 0) {
		console.error("Response is empty.");
		return false;
	}
	if (response[0] === undefined) {
		console.error("Response[0] is undefined.");
		return false;
	}
	return true;
};
