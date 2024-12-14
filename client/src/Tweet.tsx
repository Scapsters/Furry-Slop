import React from "react";
import TweetData from "../../interfaces/TweetData.ts";

/**
 * Displays a bundle of images.
 * @param imageDataArray - An array of ImageData objects.
 */
export const Tweet: React.FC<TweetProps> = ({ tweetData }) => {

    if(!tweetData.has_media) return <p> No Media </p>
    if(tweetData.media_details === undefined) return <p> Error. Tweet data indicated media but no media found </p>

    return <div className="furryslopcontainer">
        {tweetData.media_details.map(media => {
            console.log(media.type)
            if(media.type === 'image') return <img src={media.url} key={media.url} alt={media.url}/>
            else return <video src={media.url} key={media.url} controls/>
        })}
    </div>
}

interface TweetProps {
    tweetData: TweetData
}

export default Tweet