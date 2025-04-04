import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Home } from "./App/Home.tsx";
import { TweetQueue } from "./TweetQueue.tsx";
import { defaultSettings, SettingsContext } from "./App/Home/Settings.tsx";
import { DEV } from "./Dev.ts";

export const API = DEV ? "http://localhost:5000" : "https://furryslop.com";

export const apiContext = React.createContext<string>(API);
export const tweetQueueContext = React.createContext<TweetQueue | null>(null);
export const settingsContext = React.createContext<SettingsContext | null>(
	null
);

export const App = ({ entry }: { entry: boolean }) => {
	let { tweetId } = useParams();
	const path = useLocation().pathname.toLowerCase();
	const navigate = useNavigate();

	// Ensure trailing slash (for history management)
	useEffect(() => {
		if (path === "/slop" || path === "/tweet") {
			navigate(path + "/");
		}
	}, [path, navigate]);

	// tweetId sanitization
	if (tweetId === undefined || (tweetId !== null && !/^\d+$/.test(tweetId))) {
		tweetId = "";
	}

	// When navigated through the default url, give them a small set of vetted images.
	const isSlop = !!path.match(/\/[Ss]lop\//);

	// Instantiate tweet queue
	const tweetQueue = useTweetQueue(isSlop, tweetId, entry);

	// Instantiate settings context
	const [settings, setSettings] = useState(defaultSettings);
	const settingsMemo = useMemo(
		() => ({ settings, setSettings }),
		[settings, setSettings]
	);

	console.log("render - entry: " + entry + " - tweetId: " + tweetId);
	return (
		<apiContext.Provider value={API}>
			<tweetQueueContext.Provider value={tweetQueue}>
				<settingsContext.Provider value={settingsMemo}>
					<Home tweetId={tweetId} />
				</settingsContext.Provider>
			</tweetQueueContext.Provider>
		</apiContext.Provider>
	);
};

function useTweetQueue(
	isSlop: boolean,
	tweetId: string | undefined,
	entry: boolean
) {
	const apiTarget = isSlop ? "/Slop" : "/Tweets";

	// getFirst relies on both a useState and a useEffect in order to minimize recomputations when the tweetId changes.
	const [getFirst, setGetFirst] = useState(() =>
		tweetId
			? () => fetch(`${API}/Api/Tweets/${tweetId}`)
			: () => fetch(`${API}/Api${apiTarget}/RandomTweetData`)
	);

	useEffect(() => {
		if (!entry) return;
		setGetFirst(() =>
			tweetId
				? () => fetch(`${API}/Api/Tweets/${tweetId}`)
				: () => fetch(`${API}/Api${apiTarget}/RandomTweetData`)
		);
	}, [entry, tweetId, apiTarget]);

	// getNext does not require as much state management.
	const getNext = useMemo(
		() => () => fetch(`${API}/Api${apiTarget}/RandomTweetData`),
		[apiTarget]
	);

	// Instantiate tweet queue. <Home/> will use this to set up a state object for the current tweet.
	const tweetQueue = useMemo(
		() => new TweetQueue(getFirst, getNext),
		[getFirst, getNext]
	);

	return tweetQueue;
}

export default App;
