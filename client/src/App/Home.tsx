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

export const Home = ({ wasBackUsed, setWasBackUsed }) => {
	const tweetQueue = useContext(tweetQueueContext)!;

	// Create state for current tweet
	const [tweetPromise, setTweetPromise] = useState(
		Promise.resolve<Tweet | null>(null)
	);

	//  Allow the tweet queue to update the current tweet
	const advanceQueue = useCallback(() => {
		setTweetPromise(tweetQueue.dequeue());
	}, [tweetQueue]);
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

	// wait for tweet data responses
	const [tweetData] = usePromise(tweet?.data ?? null, null);

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

	const status_id = tweetData?.status_id;
	const url = `http://localhost:3000/?tweetId=${status_id}`;

	const [lastPushedState, setLastPushedState] = useState(
		window.history.state
	);

	useEffect(() => {
		const handlePopstate = (_) => setWasBackUsed(true);
		window.addEventListener("popstate", handlePopstate);
		return () => window.removeEventListener("popstate", handlePopstate);
	}, [setWasBackUsed]);

	if (
		window.location.href !== url && // Manual refresh (Advancing the queue)
		!wasBackUsed &&  // Repeated back button presses
		status_id && // Temporary undefined status_id on loading the page with no querey params
		status_id !== lastPushedState?.info // First back button press
	) {
		window.history.pushState({ info: status_id }, "", url);
		setLastPushedState({ info: status_id });
	}

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
				<Refresh next={advanceQueue} setWasBackUsed={setWasBackUsed} />
				<SettingsMenu />
			</div>
		</div>
	);

	// Thank you copilot vvv
	// pwease cwean me up uwu :3 :3 :3
};
