import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
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
import { useLocation, useNavigate } from "react-router-dom";

export const Home = ({ tweetId }) => {
	// Create state for current tweet
	const [tweetPromise, setTweetPromise] = useState(
		Promise.resolve<Tweet | null>(null)
	);

	// Get the tweet queue and allow it to update the current tweet
	const tweetQueue = useContext(tweetQueueContext)!;
	const advanceQueue = useCallback(() => {
		setTweetPromise(tweetQueue.dequeue());
	}, [tweetQueue]);
	useEffect(advanceQueue, [advanceQueue]); // Advance queue on queue change

	// Get the first and next tweet in the queue
	const [tweet, isTweetLoading] = usePromise(tweetPromise, null);
	const [nextTweet] = usePromise(tweetQueue.peek(), null);

	// When all media url responses are errors, automatically skip
	useSkipBrokenPosts(tweet, advanceQueue);

	// Enable history management TODO: Revamp history management or find way to refresh the back when using the back arrow
	const setWasBackUsed = useManageHistory(tweet, tweetId);

	return (
		<div className="home">
			<Post
				tweet={tweet}
				isTweetLoading={isTweetLoading}
				nextTweet={nextTweet}
				skipPost={advanceQueue}
			/>
			<div className="evenly-spaced-row menu">
				<Info tweet={tweet} isTweetLoading={isTweetLoading} />
				<Refresh next={advanceQueue} setWasBackUsed={setWasBackUsed} />
				<SettingsMenu />
			</div>
		</div>
	);
};

const useSkipBrokenPosts = (tweet: Tweet | null, advanceQueue: () => void) => {
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
			console.log("skipping");
			advanceQueue();
		}
	}, [isResponsesLoading, responses, advanceQueue]);
};

const useManageHistory = (tweet: Tweet | null, param: string) => {
	const navigate = useNavigate();
	const prevLocation = useLocation().pathname.match(/.*\/+/)?.[0];

	// wait for tweet data responses in order to compare with previous state
	const [tweetData] = usePromise(tweet?.data ?? null, null);
	const status_id = tweetData?.status_id;

	// Intantiate back/forward button tracking.
	// <Refresh> also manages this by setting it to false
	const [wasBackUsed, setWasBackUsed] = useState(false);

	// When the user uses the back or forward arrow, set wasBackUsed to true. This takes an extra action to register, so we keep track of the most recent previous state.
	useEffect(() => {
		const handlePopstate = (_) => setWasBackUsed(true);
		window.addEventListener("popstate", handlePopstate);
		return () => window.removeEventListener("popstate", handlePopstate);
	}, [setWasBackUsed]);

	// Keep track of what the last pushed history state was to compare it to the current status_id
	const lastPushedState = useRef<string | undefined>(undefined);

	useEffect(() => {
		if (
			status_id && // Temporary undefined status_id on loading the page with no querey params
			!wasBackUsed && // 2nd back button press and onwards
			param !== status_id && // Don't push if the url is already correct
			status_id !== lastPushedState.current // Don't push on manual refresh
		) {
			navigate(`${prevLocation}${status_id}`);
			lastPushedState.current = status_id;
		}
	}, [
		status_id,
		param,
		wasBackUsed,
		lastPushedState,
		prevLocation,
		navigate,
	]);

	return setWasBackUsed;
};
