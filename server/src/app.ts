import express, { Request, Response } from "express";
import cors from "cors";
import { ALLOWED_ORIGINS, FURRYSLOP, BUILD_PATH, SERVER_PORT } from "./dev.ts";
import type { TweetData } from "../../Interfaces/TweetData.ts";
import { DB_RESTART_ACCOUNTS, DB_RESTART_POSTS, DB_TOTAL_RESTART } from "./db/db.ts";
import { TweetsForScrapers } from "./crawler.ts";
import { RESET_ACCOUNTS, RESET_DATABASE, RESET_POSTS } from "../Dev.ts";
import { queryPostForTweetID, queryRandomPost } from "./db/tweets/tweets.ts";
import path from "path";
import { fileURLToPath } from "url";
import { createAccount, login, logout } from "./db/users/users.ts";
import { hasViewed } from "./db/views/views.ts";
import { addBan, isBanned } from "./db/bans/bans.ts";
import { validateSession } from "./db/users/processing.ts";

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

	if (!validate({ tweetid })) {
		res.send({ response: "Invalid tweetid" });
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

async function CreateAccount(req: Request, res: Response) {
	console.log("CreateAccount called with body:", req.body);

	const { username, password_hash } = req.body as {
		username: string;
		password_hash: string;
	};

	if (!validate({ username, password_hash })) {
		console.log("CreateAccount validation failed");
		res.send({ response: "Invalid body" });
		return;
	}

	const result = await createAccount(username, password_hash);
	console.log("CreateAccount result:", result);
	sendResult(res, result);
}

async function HasViewed(req: Request, res: Response) {
	console.log("HasViewed called with body:", req.body, "and params:", req.params);
	const { username } = req.body as { username: string };
	const { tweetid } = req.params as { tweetid: string };

	if (!validate({ username, tweetid })) {
		console.log("HasViewed validation failed");
		res.send({ response: "Invalid body" });
		return;
	}

	const result = await hasViewed(username, tweetid);
	console.log("CreateAccount result:", result);
	sendResult(res, result);
}

async function Login(req: Request, res: Response) {
	console.log("Login called with body:", req.body);
	const { username, password_hash } = req.body as {
		username: string;
		password_hash: string;
	};

	if (!validate({ username, password_hash })) {
		console.log("Login validation failed");
		res.send({ response: "Invalid body" });
		return;
	}

	const result = await login(username, password_hash);
	console.log("CreateAccount result:", result);
	sendResult(res, result);
}

async function Logout(req: Request, res: Response) {
	console.log("Logout called with body:", req.body);
	const { username, session_key } = req.body as {
		username: string;
		session_key: string;
	};

	if (!validate({ username, session_key })) {
		console.log("Logout validation failed");
		res.send({ response: "Invalid body" });
		return;
	}

	const result = await logout(username, session_key);
	console.log("CreateAccount result:", result);
	sendResult(res, result);
}

async function AddBan(req: Request, res: Response) {
	console.log("AddBan called with body:", req.body);
	const { username, session_key, status_id } = req.body as {
		username: string;
		session_key: string;
		status_id: string;
	};

	if (!validate({ username, session_key, status_id })) {
		console.log("AddBan validation failed");
		res.send({ response: "Invalid body" });
		return;
	}

	const result = await addBan(username, session_key, status_id);
	console.log("CreateAccount result:", result);
	sendResult(res, result);
}

async function IsBanned(req: Request, res: Response) {
	console.log("IsBanned called with params:", req.params);
	const { status_id } = req.params as { status_id: string };

	if (!validate({ status_id })) {
		console.log("IsBanned validation failed");
		res.send({ response: "Invalid body" });
		return;
	}

	const result = await isBanned(status_id);
	console.log("CreateAccount result:", result);
	sendResult(res, result);
}

function sendResult(res: Response, result: { error: string, [index: string]: any }) {
	const code = result.error ? 400 : 200;
	res.status(code).send(result);
}

/**
 * Performs basic validation on inputs like query parameters and body.
 * Checks if the object is undefined or if any of its properties are undefined.
 */
function validate(object: { [index: string]: any }): boolean {
	if (object === undefined) {
		return false;
	}
	for (const key in object) {
		if (object[key] === undefined) {
			return false;
		}
	}
	return true;
}

async function ResumeSession(req: Request, res: Response) {
	console.log("ResumeSession called with body:", req.body);
	console.log("hi")
	const { username, sessionKey } = req.body as {
		username: string;
		sessionKey: string;
	};
	
	if (!validate({ username, sessionKey })) {
		console.log("Session validation failed");
		res.send({ response: "Invalid body" });
		return;
	}

	const result = await validateSession(username, sessionKey) ? { error: "" } : { error: "Session key invalid." };
	console.log("ResumeSession result:", result);
	console.log("ResumeSession result:", result);
	sendResult(res, result);
}

const app = express()
	.use(express.static(BUILD_PATH))
	.use(express.json())
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
	/* Users */
	.post("/Api/Users/CreateAccount", CreateAccount)
	.get("/Api/Users/HasViewed", HasViewed)
	.post("/Api/Users/Login", Login)
	.post("/Api/Users/Logout", Logout)
	.get("/Api/Users/Resume", ResumeSession)
	/* Bans */
	.post("/Api/Bans/Add", AddBan)
	.get("/Api/Bans/IsBanned", IsBanned)
	/* Routing */
	.get(
		["/", "/tweets", "/tweets/:tweetId", "/slop", "/slop/:tweetId"],
		async (_: Request, res: Response) => {
			FURRYSLOP(res);
		}
	);

app.listen(SERVER_PORT, () => {
	console.log("Server running on port " + SERVER_PORT);
});

if (RESET_DATABASE) {
	console.log("Resetting the database");
	DB_TOTAL_RESTART();
}

if (RESET_POSTS) {
	console.log("Resetting the posts");
	DB_RESTART_POSTS();
}

if (RESET_ACCOUNTS) {
	console.log("Resetting the accounts");
	DB_RESTART_ACCOUNTS();
}