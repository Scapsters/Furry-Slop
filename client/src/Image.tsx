import React from "react";
import TweetData from "../../interfaces/TweetData.ts";

/**
 * Displays a bundle of images.
 * @param imageDataArray - An array of ImageData objects.
 */
export const ImageBundle: React.FC<ImageBundleProps> = ({ tweetData }) => {

    console.log(tweetData)
    if(tweetData.media_urls === undefined) return <p> Network error: Media URLS Undefined </p>
    
    const media_urls = tweetData.media_urls.split(',')

    return <div className="furryslopcontainer">
        {media_urls.map(url => {
            return <Image url={url} key={url}/>
        })}
    </div>
}

/**
 * Displays an image of selected artist and image id. 
 * @param artist_id - The ID of the artist. This represents a level one folder in image storage.
 * @param image_id - The ID of the image. This represents a a file in the artist's folder.
 */
export const Image: React.FC<ImageProps> = ({ url }) => {
    console.log(url)
    return <img className="furryslop" src={url} alt="Main Content"/>
}

interface ImageBundleProps {
    tweetData: TweetData
}

interface ImageProps {
    url: string
}

export default ImageBundle