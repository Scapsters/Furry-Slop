import React from "react";
import ImageData from '../../interfaces/ImageData';

/**
 * Displays a bundle of images.
 * @param imageDataArray - An array of ImageData objects.
 */
export const ImageBundle: React.FC<ImageBundleProps> = ({ imageDataArray }) => {
    return <div className="furryslopcontainer">
        {imageDataArray.map((imageData) => {
            return <Image imageData={imageData} key={`${imageData.tweetid} ${imageData.seriesnumber}`}/>
        })}
    </div>
}

/**
 * Displays an image of selected artist and image id. 
 * @param artist_id - The ID of the artist. This represents a level one folder in image storage.
 * @param image_id - The ID of the image. This represents a a file in the artist's folder.
 */
export const Image: React.FC<ImageProps> = ({ imageData: ImageData }) => {
    return <img className="furryslop" src={`http://localhost:5000/Images/${ImageData.tweetid}/${ImageData.seriesnumber}`} alt="Main Content"/>
}

interface ImageBundleProps {
    imageDataArray: ImageData[]
}

interface ImageProps {
    imageData: ImageData
}

export default ImageBundle