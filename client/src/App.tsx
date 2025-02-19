import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Home } from "./App/Home.tsx";
import { TweetQueue } from "./TweetQueue.tsx";
import { defaultSettings, SettingsContext } from "./App/Home/Settings.tsx";
import { DEV } from "./Dev.ts";

export const API = DEV ? "http://localhost:5000/" : "https://furryslop.com/";

export const tweetQueueContext = React.createContext<TweetQueue | null>(null);
export const settingsContext = React.createContext<SettingsContext | null>(null);

export const App = () => {
	const [searchParams] = useSearchParams();
	const tweetId = searchParams.get("tweetId");
	console.log(tweetId)
    
	const getFirstTweet = useMemo(() => tweetId
		? () => fetch(`${API}Api/Tweets/${tweetId}`)
		: () => fetch(`${API}Api/RandomTweetData`),
        [tweetId]
    )
        
	// Like getFirstTweet, this will eventually depend on some kind of url parameter.
	const getNextTweet = () => fetch(`${API}Api/RandomTweetData`);

    // Instantiate tweet queue. <Home/> will use this to set up a state object for the current tweet.
	const tweetQueue = useMemo(() => new TweetQueue(getFirstTweet, getNextTweet), [getFirstTweet])
    
    // Instantiate settings context
    const [settings, setSettings] = useState(defaultSettings);
    const settingsMemo = useMemo(() => ({ settings, setSettings }), [settings, setSettings]);

	return (
		<tweetQueueContext.Provider value={tweetQueue}>
        <settingsContext.Provider value={settingsMemo}>
			<Home/>
        </settingsContext.Provider>
		</tweetQueueContext.Provider>
	);
};

export default App;
