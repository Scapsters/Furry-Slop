import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Home } from "./App/Home.tsx";
import { TweetQueue } from "./TweetQueue.tsx";
import { defaultSettings, SettingsContext } from "./App/Home/Settings.tsx";
import { DEV } from "./Dev.ts";

export const API = DEV ? "http://localhost:1000" : "https://furryslop.com";

export const tweetQueueContext = React.createContext<TweetQueue | null>(null);
export const settingsContext = React.createContext<SettingsContext | null>(
	null
);

export const App = () => {
	let { tweetId } = useParams();
	let path = useLocation().pathname;
	let navigate = useNavigate();

	useEffect(() => {
		if (path === "/slop") {
			navigate("/slop/");
		}

		if (path === "/tweets") {
			navigate("/tweets/");
		}
	}, [path, navigate]);

	// tweetId sanitization
	if (tweetId === undefined || (tweetId !== null && !/^\d+$/.test(tweetId))) {
		tweetId = "";
	}

	// When recruiters see this, give them a small set of vetted images.
	const isSlop = path.match(/\/[Ss]lop\//);
	const apiTarget = isSlop ? "/Slop" : "/Tweets";

	console.log(apiTarget);

	// The first tweet will be based on the path and existence of a tweetId parameter.
	const getFirstTweet = useMemo(
		() =>
			tweetId
				? () => fetch(`${API}/Api/Tweets/${tweetId}`)
				: () => fetch(`${API}/Api${apiTarget}/RandomTweetData`),
		[tweetId, apiTarget]
	);

	// Like getFirstTweet, this will eventually depend on some kind of url parameter.
	const getNextTweet = useMemo(
		() => () => fetch(`${API}/Api${apiTarget}/RandomTweetData`),
		[apiTarget]
	);

	// Instantiate tweet queue. <Home/> will use this to set up a state object for the current tweet.
	const tweetQueue = useMemo(
		() => new TweetQueue(getFirstTweet, getNextTweet),
		[getFirstTweet, getNextTweet]
	);

	// Instantiate settings context
	const [settings, setSettings] = useState(defaultSettings);
	const settingsMemo = useMemo(
		() => ({ settings, setSettings }),
		[settings, setSettings]
	);

	return (
		<tweetQueueContext.Provider value={tweetQueue}>
			<settingsContext.Provider value={settingsMemo}>
				<Home tweetId={tweetId} />
			</settingsContext.Provider>
		</tweetQueueContext.Provider>
	);
};

export default App;
