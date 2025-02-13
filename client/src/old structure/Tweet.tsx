import React from "react";
import TweetData, { type MediaDetails } from "../../../interfaces/TweetData.ts";
import "./Tweet.css";

/**
 * Displays a bundle of images.
 * @param imageDataArray - An array of ImageData objects.
 */
export const Tweet: React.FC<TweetProps> = ({ tweetData }) => {

    if(!tweetData.has_media) return <p> No Media </p>
    if(tweetData.media_details === undefined) return <p> Error. Tweet data indicated media but no media found </p>

    const getMediaTag = (media: MediaDetails ) => {
        if(media.type === 'image') 
            return <img className="strictFit" src={media.url} key={media.url} alt={media.url}/>
        else 
            return <video className="strictFit" src={media.url} key={media.url} controls loop/>
    }

    return (
        <div className="tweet">
            <div className="images"> 
                {tweetData.media_details.map(getMediaTag)}
            </div>
            
            <p className="artistDetails">
                <span className="artistDisplayName">{tweetData.owner_display_name}</span>
                <a href={`https://twitter.com/${tweetData.owner_screen_name}`} className="artistScreenName">@{tweetData.owner_screen_name}</a>
                <span className="tweetText">{`${tweetData.tweet_text_content}`}</span>
            </p>
        </div>
    )
}

interface TweetProps {
    tweetData: TweetData
}

export default Tweet