import type Timestamp from "./Timestamp.ts"

/**
 * Interface for ImageData
 * 
 * @param id The id of the image
 * @param artist The artist of the image
 * @param URL The URL of the image
 * @param date The date the image was created
 * @param time The time the image was created
 * @param timezone The timezone the image was created in
 * @param seriesNumber The series number of the image
 * @param extension The extension of the image
 */
export interface ImageData {
    id: number
    artist: string
    URL: string
    timestamp: Timestamp
    seriesNumber: number
    extension: string
}

export default ImageData