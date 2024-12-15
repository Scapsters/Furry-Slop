import TweetData, { sqlToTweetData } from '../../../interfaces/TweetData.ts';
import sql from './db.ts';

export const quereyRandomPost = async (): Promise<TweetData> => {
    const randomTweetID = await quereyRandomTweetID()
    const post = await quereyPostForTweetID(randomTweetID)
    return post
}

export const quereyPostForTweetID = async (tweetID: string): Promise<TweetData> => {
    const post = (await sql`
        SELECT * FROM posts
        WHERE status_id = ${String(tweetID)}
    `)[0]
    return sqlToTweetData(post)
}

export const quereyRandomTweetID = async (): Promise<string> => {
    const numberOfImages = (await sql`SELECT COUNT(*) FROM posts`)[0]

    const randomID = Math.floor(Math.random() * numberOfImages.count)
    
    const randomTweetID = (await sql`
        SELECT status_id FROM posts
        WHERE id = ${randomID}
    `)[0].status_id

    return randomTweetID
}