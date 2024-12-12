import React from "react";
import ImageData from '../../interfaces/ImageData';

/**
 * Displays an image of selected artist and image id. 
 * @param artist_id - The ID of the artist. This represents a level one folder in image storage.
 * @param image_id - The ID of the image. This represents a a file in the artist's folder.
 * @returns 
 */
export const Image: React.FC<ImageProps> = ({ imageData: ImageData }) => {
    return <img src={ImageData.imageURL} alt="Main Content"/>
}

interface ImageProps {
    imageData: ImageData
}

export default Image