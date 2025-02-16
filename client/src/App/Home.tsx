import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Home.css";
import { useParams } from "react-router-dom";
import { Post } from "./Post.tsx";
import {
	defaultSettings,
	Settings,
	SettingsContext,
} from "./Home/Settings.tsx";
import { Info } from "./Home/Info.tsx";
import { Refresh } from "./Home/Refresh.tsx";
import { Tweet , TweetQueue } from "../TweetQueue.tsx";
import { usePromise } from "../usePromise.tsx";

export const settingsContext =
	React.createContext<SettingsContext>(defaultSettings);

export const Home = () => {
	const { tweetid } = useParams();

	// Settings is a context with a setter that is memoized to reduce redenders of recipients of the context
	const [settings, setSettings] = useState(defaultSettings);
	const settingsContextMemo = useMemo(
		() => ({ ...settings, setSettings }),
		[settings]
	);
    
	// postQueue is a ref that will be set to fill by an async function every render.
    const [tweetPromise, setTweetPromise] = useState<Promise<Tweet | null>>(Promise.resolve(null));
    const tweetQueue = useMemo(() => new TweetQueue(), []); 

    const [tweet, isTweetLoading] = usePromise(tweetPromise, null)
	const advanceQueue = useCallback(() => setTweetPromise(tweetQueue.dequeue()), [tweetQueue])

	useEffect(advanceQueue, [advanceQueue])

	// wait for media url responses
	const [responsesPromise] = usePromise(tweet?.mediaUrlResponses, []);
	const reponsesMemo = useMemo(() => Promise.all(responsesPromise), [responsesPromise]);
	const [responses, isResponsesLoading] = usePromise(reponsesMemo, []);

	useEffect(() => {
		if(!isResponsesLoading && responses.length !== 0 && responses.every(response => response.ok === false)) {
			advanceQueue();
		}
	}, [isResponsesLoading, responses, advanceQueue])

	return (
		<settingsContext.Provider value={settingsContextMemo}>
			<div className="home">
				<Post tweet={tweet} isTweetLoading={isTweetLoading} skipPost={advanceQueue}/>
				<div className="evenly-spaced-row menu">
					<Info tweet={tweet} isTweetLoading={isTweetLoading}/>
					<Refresh next={advanceQueue}/>
					<Settings />
				</div>
			</div>
		</settingsContext.Provider>
	);

    // Thank you copilot vvv
    // pwease cwean me up uwu :3 :3 :3 
};
