export interface TweetData {
    full_url: string;
    created_at: string;
    tweet_text: string;
    owner_screen_name: string;
    owner_display_name: string;
    status_id: number;
    favorite_count: number;
    has_media: boolean;
    media_urls: string | undefined;
    media_details: MediaDetails[] | undefined;
    error: string | undefined;
}

export default TweetData;
  
export interface MediaDetails {
    type: string;
    url: string;
    owner: string;
}

export const sqlToTweetData = (sqlData: any): TweetData => {
    return {
        full_url: sqlData.full_url,
        created_at: sqlData.created_at,
        tweet_text: sqlData.tweet_text,
        owner_screen_name: sqlData.owner_screen_name,
        owner_display_name: sqlData.owner_display_name,
        status_id: Number(sqlData.status_id),
        favorite_count: Number(sqlData.favorite_count),
        has_media: sqlData.has_media === 'true',
        media_urls: sqlData.media_urls,
        media_details: JSON.parse(sqlData.media_details),
        error: undefined
    }
}