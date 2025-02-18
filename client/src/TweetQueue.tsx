import TweetData from "../../Interfaces/TweetData.ts";
import { API } from "./App.tsx";

export type Tweet = {
	data: Promise<TweetData>;
	mediaUrlResponses: Promise<Promise<Response>[]>;
	imageUrls: Promise<Promise<string>[]>;
};

export class TweetQueue {
	size = 10;
	items: Promise<Tweet>[] = [];

	getFirstTweet = () => fetch(`${API}Api/RandomTweetData`);
	getNextTweet = () => fetch(`${API}Api/RandomTweetData`);

	constructor(
		getFirstTweet: () => Promise<Response>,
		getNextTweet: () => Promise<Response>
	) {
		this.getFirstTweet = getFirstTweet;
		this.getNextTweet = getNextTweet;
		this.items.push(this.getTweet(getFirstTweet()));
		this.fillQueue();
	}

	async dequeue() {
		return this.fillQueue().then(
			() => this.items.shift() as Promise<Tweet>
		);
	}

	async fillQueue() {
		for (let i = 0; i < this.size - this.items.length; i++)
			this.items.push(this.getTweet(this.getNextTweet()));
	}

	async getTweet(tweetDataResponse: Promise<Response>) {
		const tweetData = tweetDataResponse.then((response) =>
			response.json().then((json) => json as TweetData)
		);

		const mediaUrls = tweetData.then(
			(tweetData) =>
				tweetData.media_details?.map((details) => details.url) ?? []
		);

		const mediaUrlResponses = mediaUrls.then((mediaUrls) =>
			mediaUrls.map((url) => fetch(url))
		);

		const localMediaUrls = mediaUrlResponses.then((mediaUrlResponses) =>
			mediaUrlResponses.map((response) =>
				response
					.then((response) => response.blob())
					.then((data) => URL.createObjectURL(data))
			)
		);

		return {
			data: tweetData,
			mediaUrlResponses: mediaUrlResponses,
			imageUrls: localMediaUrls,
		};
	}

	async peek() {
		return this.items[0];
	}
}
