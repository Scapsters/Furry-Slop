import postgres from "postgres";
import fs from "fs";
import path from "path";
import TweetData from "../../../Interfaces/TweetData";
import { DB_CONFIG } from "../../Dev";
const POST_PATH: string = "../Twitter Likes 12-14-2024";

export const sql = postgres(DB_CONFIG);

export default sql;

export const DB_RESTART_POSTS = async () => {
	console.log("awaiting posts restart...");
	await posts_restart();
	console.log("awaiting createImages...");
	await createPosts();
	console.log("Database reset");
};

export const DB_RESTART_ACCOUNTS = async () => {
	console.log("awaiting account restart...");
	await accounts_restart();
	console.log("Accounts reset");
}

/**
 * Table schema
 */
const posts_restart = async () => {
	await sql`DROP TABLE IF EXISTS posts`;
	return await sql`
        CREATE TABLE posts (
            id                  SERIAL PRIMARY KEY,
            status_id           TEXT                NOT NULL,
            full_url            TEXT                NOT NULL,
            created_at          VARCHAR(30)         NOT NULL,
            tweet_text          TEXT                NOT NULL,
            owner_screen_name   TEXT                NOT NULL,
            owner_display_name  TEXT                NOT NULL,
            favorite_count      INTEGER             NOT NULL,
            has_media           TEXT                NOT NULL,
            media_urls          TEXT,
            media_details       JSON
        )`;
};

const accounts_restart = async () => {
	await sql`DROP TABLE IF EXISTS accounts`;
	return await sql`
		CREATE TABLE accounts (
			id SERIAL PRIMARY KEY,
			username TEXT NOT NULL UNIQUE, 
			password_hash VARCHAR(88) NOT NULL
			session_token VARCHAR(88)
			session_expiration TIMESTAMP
			current_tweet_id INTEGER
		)
	`
}

/**
 * Populate posts with posts from POST_PATH
 */
const createPosts = async () => {
	for (const folderName of fs.readdirSync(POST_PATH)) {
		const folderPath = path.join(POST_PATH, folderName);

		for (const imageName of fs.readdirSync(folderPath)) {
			const image = await parseTweetData(
				path.join(folderPath, imageName)
			);

			if (image.error) {
				continue;
			}

			await sql`
                INSERT INTO posts (
                    status_id,
                    full_url,
                    created_at,
                    tweet_text,
                    owner_screen_name,
                    owner_display_name,
                    favorite_count,
                    has_media,
                    media_urls,
                    media_details
                ) VALUES (
                    ${image.status_id},
                    ${image.full_url},
                    ${image.created_at},
                    ${image.tweet_text},
                    ${image.owner_screen_name},
                    ${image.owner_display_name},
                    ${image.favorite_count},
                    ${image.has_media},
                    ${image.media_urls ?? null},
                    ${JSON.stringify(image.media_details) || null}
                )
            `;
			console.log(
				`Inserted ${image.owner_display_name} ${image.status_id} into the database`
			);
		}
	}
};

/**
 * Parse tweet data from a json file
 */
const parseTweetData = async (filepath: string): Promise<TweetData> => {
	const tweetData: TweetData = await readJsonFile(filepath).then(
		(fullData) => fullData.otherPropertiesMap
	);
	if (tweetData.error) return tweetData;

	const date = tweetData.created_at
		.split(" ")
		.slice(1, 2)
		.concat(tweetData.created_at.split(" ").slice(5, 6))
		.join(" ");

	return {
		...tweetData,
		created_at: date,
	};
};

/**
 * Get the contents of a json file
 */
const readJsonFile = (filePath: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		fs.readFile(
			filePath,
			"utf8",
			(err: NodeJS.ErrnoException | null, data: string) => {
				if (err) reject(err);
				else
					try {
						resolve(JSON.parse(data));
					} catch (parseErr: any) {
						reject(new Error(parseErr.message));
					}
			}
		);
	});
};

// This is copied from the client
export const createEmptyTweetData = (): TweetData => {
	return {
		status_id: "0",
		full_url: "",
		created_at: "",
		tweet_text: "",
		tweet_text_content: "",
		tweet_text_link: "",
		owner_screen_name: "",
		owner_display_name: "",
		favorite_count: 0,
		has_media: false,
		media_urls: "",
		media_details: [],
		error: undefined,
	};
};
