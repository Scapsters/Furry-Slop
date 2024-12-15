import React from "react";
import TweetData, { type MediaDetails } from "../../interfaces/TweetData.ts";
import style from "./Tweet.module.css";

/**
 * Displays a bundle of images.
 * @param imageDataArray - An array of ImageData objects.
 */
export const Tweet: React.FC<TweetProps> = ({ tweetData }) => {

    if(!tweetData.has_media) return <p> No Media </p>
    if(tweetData.media_details === undefined) return <p> Error. Tweet data indicated media but no media found </p>

    const getMediaTag = (media: MediaDetails ) => {
        if(media.type === 'image') 
            return <img src={media.url} key={media.url} alt={media.url}/>
        else 
            return <video src={media.url} key={media.url} controls/>
    }

    return (
        <div className="column tweet">
            <div className="row"> 
                {tweetData.media_details.map(getMediaTag)}
            </div>
            
            <p> {tweetData.owner_display_name} </p>
        </div>
    )
}

interface TweetProps {
    tweetData: TweetData
}

export default Tweet