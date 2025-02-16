import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./Home.css";
import { useNavigate, useParams } from "react-router-dom";
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
import { API } from "../App.tsx";

export const settingsContext =
	React.createContext<SettingsContext>(defaultSettings);

export const Home = () => {
	const { tweetid } = useParams();
	const navigate = useNavigate();

	// Settings is a context with a setter that is memoized to reduce redenders of recipients of the context
	const [settings, setSettings] = useState(defaultSettings);
	const settingsContextMemo = useMemo(
		() => ({ ...settings, setSettings }),
		[settings]
	);

	const getUrlTweet = useCallback(async () => await fetch(`${API}Api/Tweets/${tweetid}`), [tweetid]);
	const getRandomTweet = useCallback(async () => await fetch(`${API}Api/RandomTweetData`), []);
	
    
	// postQueue is a ref that will be set to fill by an async function every render.
    const [tweetPromise, setTweetPromise] = useState<Promise<Tweet | null>>(Promise.resolve(null));
    const tweetQueue = useMemo(() => new TweetQueue(getUrlTweet, getRandomTweet), [getUrlTweet, getRandomTweet]); 

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

	// wait for tweet data to redirect
	const [tweetData, isLoading] = usePromise(tweet?.data, null);

	const [previousTweetId, setPreviousTweetId] = useState<string | null>(null);
	useEffect(() => {
		if(tweetData !== null) setPreviousTweetId(tweetData.status_id)
	}, [tweetData])

	useEffect(() => {
		if (!isLoading && tweetData !== null && previousTweetId !== tweetData.status_id) {
			console.log('redirecting to tweet', tweetData.status_id)
			navigate(`/Tweets/${tweetData.status_id}`, { replace: false });
		}
	}, [navigate, tweetData, isLoading, previousTweetId]);

	

	// const navigateToTweet = useCallback(
	// 	() => {
	// 		if(tweetData !== null && previousTweetId !== tweetData.status_id) {
	// 			console.log('redirecting to tweet', tweetData.status_id)
	// 			setPreviousTweetId(tweetData.status_id);
	// 			window.history.pushState({}, "", `/Tweets/${tweetData.status_id}`);
	// 			//navigate(`/Tweets/${tweetData.status_id}`, { replace: false})
	// 		}
	// 	}, [tweetData, navigate, previousTweetId]);
	// useEffect(navigateToTweet, [navigateToTweet]);

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
