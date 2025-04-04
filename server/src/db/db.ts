import postgres from "postgres";
import { DB_CONFIG } from "../../Dev";
import { createPosts } from "./tweets/processing";
export const POST_PATH: string = "../Twitter Likes 12-14-2024";

export const sql = postgres(DB_CONFIG);

export default sql;

/**
 * Restart and recreate the posts table.
 */
export async function DB_RESTART_POSTS() {
	await posts_restart();
	await createPosts();
	console.log("Database reset");
}

/**
 * Restart and recreate the users table.
 * As a side effect, this will also recreate the views table.
 */
export async function DB_RESTART_ACCOUNTS() {
	await users_restart();
	console.log("Accounts reset");
}

/**
 * Restart and recreate the bans table.
 * Bans persist across post restarts.
 */
export async function DB_RESTART_BANS() {
	await bans_restart();
	console.log("Bans reset");
}

/**
 * Restart and recreate the entire database.
 */
export async function DB_TOTAL_RESTART() {
	await DB_RESTART_POSTS();
	await DB_RESTART_ACCOUNTS();
	await bans_restart();
	console.log("Total reset");
}

async function posts_restart() {
	await sql`DROP TABLE IF EXISTS posts`;
	return await sql`
        CREATE TABLE posts (
            id                  SERIAL PRIMARY KEY,
            status_id           BIGINT                NOT NULL,
            full_url            TEXT                  NOT NULL,
            created_at          VARCHAR(30)           NOT NULL,
            tweet_text          TEXT                  NOT NULL,
            owner_screen_name   TEXT                  NOT NULL,
            owner_display_name  TEXT                  NOT NULL,
            favorite_count      INTEGER               NOT NULL,
            has_media           BOOLEAN               NOT NULL,
            media_urls          TEXT,
            media_details       JSON
        )`;
}

async function bans_restart() {
	await sql`DROP TABLE IF EXISTS bans`;
	return await sql`
		CREATE TABLE bans (
			id                  SERIAL PRIMARY KEY,
			status_id			TEXT                NOT NULL
		)`; // status_id doesnt reference posts to persist across restarts
}

async function users_restart() {
	await sql`DROP TABLE IF EXISTS views`;
	await sql`DROP TABLE IF EXISTS users`;
	await sql`
		CREATE TABLE users (
			id                     SERIAL PRIMARY KEY,
			username               TEXT NOT NULL UNIQUE, 
			password_hash          VARCHAR(88) NOT NULL,
			session_key            VARCHAR(88),
			session_expiration     TIMESTAMP,
			permissions            INTEGER DEFAULT 0,
			created_at             TIMESTAMP DEFAULT NOW()
		)
	`;
	return await create_views();
}

async function create_views() {
	return await sql`
		CREATE TABLE views (
			id        SERIAL PRIMARY KEY,
			username   TEXT NOT NULL UNIQUE REFERENCES users(username), 
			status_id TEXT NOT NULL UNIQUE
		)
	`; // status_id doesnt reference posts to persist across restarts
}

/**
 * General validation method for SQL responses.
 * Checks if the response is undefined, empty, or if the first element is undefined.
 */
export function validateResponse(response: any): boolean {
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