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

export const Home = ({ searchParams, setSearchParams }) => {
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

	//const setWasBackUsed = useManageHistory(tweetData?.status_id)
	const setWasBackUsed = useManageHistory(
		tweetData?.status_id,
		searchParams,
		setSearchParams
	);

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

const useManageHistory = (
	status_id: string | undefined,
	searchParams: URLSearchParams,
	setSearchParams: React.Dispatch<React.SetStateAction<{ tweetId: string }>>
) => {

	// Intantiate back/forward button tracking.
	// <Refresh> also manages this by setting it to false
	const [wasBackUsed, setWasBackUsed] = useState(false);

	// Manage wasBackUsed state 
	useEffect(() => {
		const handlePopstate = (_) => setWasBackUsed(true);
		window.addEventListener("popstate", handlePopstate);
		return () => window.removeEventListener("popstate", handlePopstate);
	}, [setWasBackUsed]);

	// Keep track of what the last pushed history state was
	const [lastPushedState, setLastPushedState] = useState(
		window.history.state
	);

	if (
		status_id && // Temporary undefined status_id on loading the page with no querey params
		searchParams.get("tweetId") && // Temporary undefined status_id on loading the page with no querey params
		!wasBackUsed && // 2nd back button press and onwards
		status_id !== window.history.state?.info && // TODO: verify if this matters
		searchParams.get("tweetId") !== status_id && // Don't push if the url is already correct
		status_id !== lastPushedState?.info // Don't push on manual refresh
	) {
		setSearchParams({ tweetId: status_id });
		setLastPushedState({ info: status_id });
	}

	return setWasBackUsed;
};
