import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const makePath = (relativePath: string) => path.join(__dirname, relativePath)

/*
 * All images are stored in folders in the images directory. 
 * This folder should be created using WFDownloaderApp at https://www.wfdownloader.xyz/download
 */
const IMAGE_FILEPATH: string = 'C:\\Users\\Scott\\OneDrive\\Pictures\\Furry Art\\Twitter Likes'

export const getRandomImage = (): string => {
    const folders       = getFolderNames()
    const randomFolder  = folders[Math.floor(Math.random() * folders.length)]
    const folderPath    = path.join(IMAGE_FILEPATH, randomFolder)
    const images        = fs.readdirSync(folderPath)
    const randomImage   = images[Math.floor(Math.random() * images.length)]
    return path.join(folderPath, randomImage)
}

/**
 * Get all the folder names in the images directory.
 * Assumes that all files in the images directory are folders.
 */
const getFolderNames = (): string[] => {
    return fs.readdirSync(IMAGE_FILEPATH)
}

export default getRandomImage