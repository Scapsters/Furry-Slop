import path from 'path'
import { fileURLToPath } from 'url'
import { quereyImageForTweetID, quereyRandomImage } from './db/db_images.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const makePath = (relativePath: string) => path.join(__dirname, relativePath)

/*
 * All images are stored in folders in the images directory. 
 * This folder should be created using WFDownloaderApp at https://www.wfdownloader.xyz/download
 */
const IMAGE_FILEPATH: string = 'C:\\Users\\Scott\\OneDrive\\Pictures\\Furry Art\\Twitter Likes'

export const getRandomImageData = async () => await quereyRandomImage()

export const getImageForTweetID = async (tweetID: number) => await quereyImageForTweetID(tweetID)
