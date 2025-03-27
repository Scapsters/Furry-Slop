import type { Response } from "express";
import path from "path";
import { DEV } from "../Dev.ts";

// React's build folder
export const BUILD_PATH = DEV
	? "C:/Users/Scott/Code/furryslop.com dev/client/build"
	: "C:/Users/Scott/Code/furryslop.com prod/client/build";

// React's dev server port
export const CLIENT_DEV_PORT = 3000;
// Server's dev port
export const SERVER_PORT = DEV ? 5000 : 1000;

export const ALLOWED_ORIGINS = [
	"http://localhost:3002", // Dev client
	"http://localhost:3001", // Prod client
	"https://furryslop.com",
	"https://www.furryslop.com",
	"https://scotthappy.com",
	"https://www.scotthappy.com",
];

export const FURRYSLOP = (res: Response) => {
	console.log("Serving furryslop index.html from buildPath");
	res.sendFile(path.join(BUILD_PATH, "index.html"));
};
