import TweetData from "../../interfaces/TweetData";

export const DEV = true;
export const API = DEV ? "http://localhost:5000/" : "https://furryslop.com/";

export type Tweet = {
	data: Promise<TweetData>;
	mediaUrlResponses: Promise<Promise<Response>[]>;
	imageUrls: Promise<Promise<string>[]>;
};

export class TweetQueue {
	size = 10;
	items: Promise<Tweet>[] = [];

	constructor() {
		this.fillQueue();
	}

	async dequeue() {
		//TODO: this can be collapsed  into just the undefined case return statement. this is to give an error if its empty since it shouldnt be
		const item = this.items.shift();
		if (item === undefined) {
			console.error("Queue is empty");
			return this.fillQueue().then(
				() => this.items.shift() as Promise<Tweet>
			); // Because fillQueue ran, this should never be undefined
		}
		return item;
	}

	async fillQueue() {
		console.log(this.items);
		const getNewTweet = async () => {
			const tweetData = fetch(`${API}Api/RandomTweetData`).then(
				(response) => response.json().then((json) => json as TweetData)
			);

			const mediaUrls = tweetData.then(
				(tweetData) => tweetData.media_urls?.split(",") ?? []
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

			return { data: tweetData, mediaUrlResponses: mediaUrlResponses, imageUrls: localMediaUrls };
		};

		console.log(
			"Filling queue with",
			this.size - this.items.length,
			"new tweets"
		);

		for (let i = 0; i < this.size - this.items.length; i++)
			this.items.push(getNewTweet());
		console.log(this.items);
	}
}
