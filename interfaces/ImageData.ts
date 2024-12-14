import type Timestamp from "./Timestamp.ts"
import sql from '../server/src/db/db';

/**
 * Interface for ImageData. Lowercase due to sql returning lowercase keys.
 * 
 * @param tweetid The tweetid of the image
 * @param artist The artist of the image
 * @param url The url of the image
 * @param timestamp The timestamp of the image
 * @param seriesnumber The series number of the image
 * @param extension The extension of the image

 */
export interface ImageData {
    tweetid: number
    artist: string
    url: string
    timestamp: Timestamp
    seriesnumber: number
    extension: string
}

export default ImageData

export const sqlToImageData = (sqlData: any): ImageData => {
    return {
        tweetid: sqlData.tweetid,
        artist: sqlData.artist,
        url: sqlData.url,
        timestamp: createTimestamp(sqlData.year, sqlData.month, sqlData.day, sqlData.hour, sqlData.minute, sqlData.second, sqlData.timezone),
        seriesnumber: sqlData.seriesnumber,
        extension: sqlData.extension
    }
}

const createTimestamp = (year: number, month: number, day: number, hour: number, minute: number, second: number, timezone: string): Timestamp => {
    return {
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        second: second,
        timezone: timezone
    }
}

export const createEmptyImageData = (): ImageData => {
    return {
        tweetid: 0,
        artist: "",
        url: "",
        timestamp: {
            year: 0,
            month: 0,
            day: 0,
            hour: 0,
            minute: 0,
            second: 0,
            timezone: ""
        },
        seriesnumber: 0,
        extension: ""
    }
}