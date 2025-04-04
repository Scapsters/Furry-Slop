import express, { Request, Response } from "express";
import cors from "cors";
import { ALLOWED_ORIGINS, FURRYSLOP, BUILD_PATH, SERVER_PORT } from "./dev.ts";
import type { TweetData } from "../../Interfaces/TweetData.ts";
import { DB_RESTART_POSTS } from "./db/db.ts";
import { TweetsForScrapers } from "./crawler.ts";
import { RESET_DATABASE } from "../Dev.ts";
import { queryPostForTweetID, queryRandomPost } from "./db/tweets/db_tweets.ts";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export function makePath(relativePath: string) {
	return path.join(__dirname, relativePath);
}

async function RandomTweetData(_: Request, res: Response) {
	res.send(await queryRandomPost(false));
}

async function SanitizedRandomTweetData(_: Request, res: Response) {
	res.send(await queryRandomPost(true));
}

async function Tweets(req: Request, res: Response) {
	const tweetid = req.params.tweetid;

	if (tweetid === undefined) {
		res.send({ response: "No body" });
		return;
	}
	// Make sure its all numbers
	if (!/^\d+$/.test(tweetid)) {
		res.send({ response: "Invalid tweetid" });
		return;
	}

	const tweetData: TweetData = await queryPostForTweetID(tweetid);
	res.send(tweetData);
}

const app = express()
	.use(express.static(BUILD_PATH))
	.use((req, _, next) => {
		console.log(`Request received: ${req.method} ${req.path} ${req.url}`);
		next();
	})
	.use(cors({ origin: ALLOWED_ORIGINS }))
	/* "Private" endpoints */
	.get("/Api/Slop/RandomTweetData", RandomTweetData)
	.get("/Api/Slop/:tweetid", Tweets)
	.get("/Slop/:tweetid", TweetsForScrapers)
	/* Sanitized endpoints */
	.get("/Api/Tweets/RandomTweetData", SanitizedRandomTweetData)
	.get("/Api/Tweets/:tweetid", Tweets)
	.get("/Tweets/:tweetid", TweetsForScrapers)
	/* Routing */
	.get(
		["/", "/tweets", "/tweets/:tweetId", "/slop", "/slop/:tweetId"],
		async (req: Request, res: Response) => {
			FURRYSLOP(res);
		}
	);

app.listen(SERVER_PORT, () => {
	console.log("Server running on port " + SERVER_PORT);
});

if (RESET_DATABASE) {
	console.log("Resetting the database");
	DB_RESTART_POSTS();
}
