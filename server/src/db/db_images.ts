import ImageData, { sqlToImageData } from '../../../interfaces/ImageData.ts';
import sql from './db.ts';

export const quereyRandomImage = async (): Promise<ImageData[]> => {
    const randomTweetID = await quereyRandomTweetID()
    const images = await quereyImageForTweetID(randomTweetID)
    return images
}

export const quereyImageForTweetID = async (tweetID: number): Promise<ImageData[]> => {
    const images = await sql`
        SELECT * FROM images
        WHERE tweetID = ${tweetID}
    `
    return images.map(sqlToImageData)
}

export const quereyRandomTweetID = async (): Promise<number> => {
    const numberOfImages = (await sql`SELECT COUNT(*) FROM images`)[0]

    const randomID = Math.floor(Math.random() * numberOfImages.count)
    
    const randomTweetID = (await sql`
        SELECT tweetID FROM images
        WHERE id = ${randomID}
    `)[0].tweetid

    return randomTweetID
}