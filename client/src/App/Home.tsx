import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import "./Home.css";
import { Post } from "./Post.tsx";
import {
	SettingsMenu,
} from "./Home/Settings.tsx";
import { Info } from "./Home/Info.tsx";
import { Refresh } from "./Home/Refresh.tsx";
import { usePromise } from "../usePromise.tsx";
import { Tweet } from "../TweetQueue.tsx";
import { tweetQueueContext } from "../App.tsx";


export const Home = () => {
    
	const tweetQueue = useContext(tweetQueueContext)!;

	// Create state for current tweet
	const [tweetPromise, setTweetPromise] = useState<Promise<Tweet | null>>(Promise.resolve(null));
	//  Allow the tweet queue to update the current tweet
	const advanceQueue = useCallback(() => setTweetPromise(tweetQueue.dequeue()), [tweetQueue])
	useEffect(advanceQueue, [advanceQueue])

    const [tweet, isTweetLoading] = usePromise(tweetPromise, null)

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
		<div className="home">
			<Post tweet={tweet} isTweetLoading={isTweetLoading} skipPost={advanceQueue}/>
			<div className="evenly-spaced-row menu">
				<Info tweet={tweet} isTweetLoading={isTweetLoading}/>
				<Refresh next={advanceQueue}/>
				<SettingsMenu />
			</div>
		</div>
	);

    // Thank you copilot vvv
    // pwease cwean me up uwu :3 :3 :3 
};
