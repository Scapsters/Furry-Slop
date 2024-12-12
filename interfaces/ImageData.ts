/**
 * Interface for Image
 * @param imageId - The ID of the image. This represents a a file in the artist's folder.
 * @param artistName - The name of the artist.
 * @param imageURL - The URL of the image.
 */
export interface ImageData {
    imageId: number
    artistName: string
    imageURL: string
}

export default ImageData