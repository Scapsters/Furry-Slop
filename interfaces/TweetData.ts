export interface TweetData {
    full_url: string;
    created_at: string;
    tweet_text: string;
    tweet_text_content: string;
    tweet_text_link: string;
    owner_screen_name: string;
    owner_display_name: string;
    status_id: string;
    favorite_count: number;
    has_media: boolean;
    media_urls: string | undefined;
    media_details: MediaDetails[] | undefined;
    error: string | undefined;
}

export interface TweetDataResponse {
    owner_screen_name: string;
    tweet_text: string;
    tweet_text_content: string;
    media_urls?: string;
}

export default TweetData;
  
export interface MediaDetails {
    type: string;
    url: string;
    owner: string;
}

