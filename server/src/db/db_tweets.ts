import TweetData from "../../../Interfaces/TweetData.ts";
import { sqlToTweetData } from "../../TweetData.ts";
import sql, { createEmptyTweetData } from "./db.ts";
import { sanitized_tweet_ids } from "./sanitized_tweets.ts";

export const queryRandomPost = async (sanitized: boolean): Promise<TweetData> => {
	const randomTweetID = await queryRandomTweetID(sanitized);
	const post = await queryPostForTweetID(randomTweetID);
	return post;
};

export const queryPostForTweetID = async (
	tweetID: string
): Promise<TweetData> => {
	const response = await getFirstRecordFromQuery(
		`SELECT * FROM posts WHERE status_id = $1`,
		[tweetID]
	);

	if (response === undefined) {
		console.error(
			"QueryPostForTweetID returned undefined on tweetID:",
			tweetID
		);
		return createEmptyTweetData();
	}

	return sqlToTweetData(response);
};

export const queryRandomTweetID = async (
	sanitized: boolean
): Promise<string> => {
	if(sanitized) {
		return sanitized_tweet_ids[Math.floor(Math.random() * sanitized_tweet_ids.length)];
	}

	const numberOfImages = (await sql`SELECT COUNT(*) FROM posts`)[0];

	const randomID = Math.floor(Math.random() * numberOfImages.count);

	const response = await getEntryFromFirstRecordFromQuery(
		`SELECT status_id FROM posts WHERE id = $1`,
		"status_id",
		[randomID]
	);

	if (response === undefined) {
		throw new Error("Why did queryRandomTweetID return undefined?");
	}

	return response;
};

const getEntryFromFirstRecordFromQuery = async (
	query: string,
	targetEntry: string,
	params: any[]
): Promise<string | undefined> => {
	const response = await getFirstRecordFromQuery(query, params);

	const entry = response[targetEntry];
	console.log("Entry:", entry);
	if (entry === undefined) {
		console.error(
			`Record found but entry ${targetEntry} was undefined for query: ${query} with params: ${params}`
		);
		return undefined;
	}

	return entry;
};

const getFirstRecordFromQuery = async (
	query: string,
	params: any[]
): Promise<any> => {
	console.log("Executing query:", query, "with params:", params);
	const response = await sql.unsafe(query, params);
	console.log("Response:", response);
	if (response.length === 0) {
		console.error(
			`No records found for query: ${query} with params: ${params}`
		);
		return undefined;
	}
	if (response === undefined) {
		console.error(
			`Response was undefined for query: ${query} with params: ${params}`
		);
		return undefined;
	}
	return response[0];
};
