import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import "./Home.css";
import { Post } from "./Post.tsx";
import { SettingsMenu } from "./Home/Settings.tsx";
import { Info } from "./Home/Info.tsx";
import { Refresh } from "./Home/Refresh.tsx";
import { usePromise } from "../usePromise.tsx";
import { Tweet } from "../TweetQueue.tsx";
import { tweetQueueContext } from "../App.tsx";
import { useNavigate } from "react-router-dom";
import { Back } from "./Home/Back.tsx";
export const Home = () => {
	const tweetQueue = useContext(tweetQueueContext)!;

	// Create state for current tweet
	const [tweetPromise, setTweetPromise] = useState<Promise<Tweet | null>>(
		Promise.resolve(null)
	);
	//  Allow the tweet queue to update the current tweet
	const advanceQueue = useCallback(
		() => setTweetPromise(tweetQueue.dequeue()),
		[tweetQueue]
	);
	useEffect(advanceQueue, [advanceQueue]);

	const GoBack = useCallback( () => window.history.back());

	const [tweet, isTweetLoading] = usePromise(tweetPromise, null);
	const [nextTweet, isNextTweetLoading] = usePromise(tweetQueue.peek(), null);

	// wait for media url responses
	const [responsesPromise] = usePromise(tweet?.data, []);
	const reponsesMemo = useMemo(	
		() => Promise.all(responsesPromise),
		[responsesPromise]
	);
	const [responses, isResponsesLoading] = usePromise(reponsesMemo, []);

	useEffect(() => {
		if (
			!isResponsesLoading &&
			responses.length !== 0 &&
			responses.every((response) => response.ok === false)
		) {
			advanceQueue();
		}
	}, [isResponsesLoading, responses, advanceQueue]);
	
	//window.history.pushState("1", "",`${API}Api/Tweets/?tweetId=${tweet.data.status_id.then((data) => data.status_id)}`);
	//console.log(responsesPromise.status_id);
	const status_id = responsesPromise.status_id;
	
	if(status_id != undefined){
	const url = `http://localhost:3000/?tweetId=${status_id}`;
	window.history.pushState({info: status_id}, "", url);
	}

	
	// console.log(isTweetLoading)
	// const navigate = useNavigate();
	// useEffect(() => {
	// 	if (!isTweetLoading && tweet) {
	// 		console.log(tweet)
	// 		navigate(`/?tweetId=${tweet.data.then((data) => data.status_id)}`);
	// 	}
	// }, [tweet, isTweetLoading, navigate]);

	return (
		<div className="home">
			<Post
				tweet={tweet}
				isTweetLoading={isTweetLoading}
				nextTweet={nextTweet}
				isNextTweetLoading={isNextTweetLoading}
				skipPost={advanceQueue}
			/>
			<div className="evenly-spaced-row menu">
				<Info tweet={tweet} isTweetLoading={isTweetLoading} />
				<Refresh next={advanceQueue} />
				<SettingsMenu />
				<Back back={GoBack} />
			</div>
		</div>
	);

	// Thank you copilot vvv
	// pwease cwean me up uwu :3 :3 :3
};
