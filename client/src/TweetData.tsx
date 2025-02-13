import TweetData from "../../interfaces/TweetData"

export const emptyTweetData: TweetData = {
    status_id: '0',
    full_url: '',
    created_at: '',
    tweet_text: '',
    tweet_text_content: '',
    tweet_text_link: '',
    owner_screen_name: '',
    owner_display_name: '',
    favorite_count: 0,
    has_media: false,
    media_urls: '',
    media_details: [],
    error: undefined
}