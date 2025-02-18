import TweetData from "../Interfaces/TweetData"

export const sqlToTweetData = (sqlData: Exclude<any, undefined>): TweetData => {
    return {
        full_url: sqlData.full_url,
        created_at: sqlData.created_at,
        tweet_text: sqlData.tweet_text,
        tweet_text_content: sqlData.tweet_text.split(' ').slice(0, -1).join(' '),
        tweet_text_link: sqlData.tweet_text.split(' ').slice(-1).join(' '),
        owner_screen_name: sqlData.owner_screen_name,
        owner_display_name: sqlData.owner_display_name,
        status_id: String(sqlData.status_id),
        favorite_count: Number(sqlData.favorite_count),
        has_media: sqlData.has_media === 'true',
        media_urls: sqlData.media_urls,
        media_details: JSON.parse(sqlData.media_details),
        error: undefined
    }
}