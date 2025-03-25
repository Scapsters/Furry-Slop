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
export const DEV_PORT = 5000;

export const ALLOWED_ORIGINS = [
	"http://localhost:3001",
	"http://localhost:5000",
	"https://furryslop.com",
	"https://www.furryslop.com",
	"https://scotthappy.com",
	"https://www.scotthappy.com",
];

export const FURRYSLOP = (res: Response) => {
			console.log("Serving furryslop index.html from buildPath");
			res.sendFile(path.join(BUILD_PATH, "index.html"));
	  };

