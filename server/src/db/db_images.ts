import TweetData, { MediaDetails, sqlToTweetData } from '../../../interfaces/TweetData.ts';
import sql from './db.ts';

export const quereyRandomPost = async (): Promise<TweetData[]> => {
    const randomTweetID = await quereyRandomTweetID()
    const post = await quereyPostForTweetID(randomTweetID)
    console.log(post)
    return post
}

export const quereyPostForTweetID = async (tweetID: number): Promise<TweetData[]> => {
    const posts = await sql`
        SELECT * FROM posts
        WHERE status_id = ${tweetID}
    `
    console.log('posts')
    console.log(posts)
    console.log('data')
    console.log(posts[0])
    return posts.map(sqlToTweetData)
}

export const quereyRandomTweetID = async (): Promise<number> => {
    const numberOfImages = (await sql`SELECT COUNT(*) FROM posts`)[0]

    const randomID = Math.floor(Math.random() * numberOfImages.count)
    
    const randomTweetID = (await sql`
        SELECT status_id FROM posts
        WHERE id = ${randomID}
    `)[0].status_id

    return randomTweetID
}