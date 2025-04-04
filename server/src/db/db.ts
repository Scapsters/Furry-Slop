import postgres from "postgres";
import { DB_CONFIG } from "../../Dev";
import { createPosts } from "./tweets/tweet_processing";
export const POST_PATH: string = "../Twitter Likes 12-14-2024";

export const sql = postgres(DB_CONFIG);

export default sql;

export async function DB_RESTART_POSTS() {
	console.log("awaiting posts restart...");
	await posts_restart();
	console.log("awaiting createImages...");
	await createPosts();
	console.log("Database reset");
}

export async function DB_RESTART_ACCOUNTS() {
	console.log("awaiting account restart...");
	await accounts_restart();
	console.log("Accounts reset");
}

async function posts_restart() {
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
}

async function deleted_posts_restart() {
	
}

async function accounts_restart() {
	await sql`DROP TABLE IF EXISTS accounts`;
	return await sql`
		CREATE TABLE accounts (
			id SERIAL PRIMARY KEY,
			username TEXT NOT NULL UNIQUE, 
			password_hash VARCHAR(88) NOT NULL,
			session_token VARCHAR(88),
			session_expiration TIMESTAMP,
			current_tweet_id INTEGER
		)
	`
}
