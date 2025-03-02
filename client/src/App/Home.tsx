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

export const Home = () => {
	const tweetQueue = useContext(tweetQueueContext)!;

	// Create state for current tweet
	const [tweetPromise, setTweetPromise] = useState(
		Promise.resolve<Tweet | null>(null)
	);

	//  Allow the tweet queue to update the current tweet
	const advanceQueue = useCallback(
		() => setTweetPromise(tweetQueue.dequeue()),
		[tweetQueue]
	);
	useEffect(advanceQueue, [advanceQueue]);

	// Get the first and next tweet in the queue
	const [tweet, isTweetLoading] = usePromise(tweetPromise, null);
	const [nextTweet, isNextTweetLoading] = usePromise(tweetQueue.peek(), null);

	// wait for media url responses
	const [responsesPromise] = usePromise(tweet?.mediaUrlResponses ?? null, []);
	const reponsesMemo = useMemo(
		() => (responsesPromise ? Promise.all(responsesPromise) : null),
		[responsesPromise]
	);
	const [responses, isResponsesLoading] = usePromise(reponsesMemo, []);

	// If all of the media url responses are errors, skip the post
	useEffect(() => {
		if (
			!isResponsesLoading &&
			responses?.length !== 0 &&
			responses?.every((response) => response.ok === false)
		) {
			advanceQueue();
		}
	}, [isResponsesLoading, responses, advanceQueue]);

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
			</div>
		</div>
	);

	// Thank you copilot vvv
	// pwease cwean me up uwu :3 :3 :3
};
