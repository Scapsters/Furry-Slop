import postgres from "postgres";
import fs from 'fs';
import path from 'path';
import ImageData from '../../interfaces/ImageData';
const IMAGE_FILEPATH: string = 'C:\\Users\\Scott\\OneDrive\\Pictures\\Furry Art\\Twitter Likes'

const sql = postgres({
    host: "localhost",
    port: 5432,
    database: "furryslop",
    username: "postgres",
    password: "101098"
})

export const DB_RESTART = async () => {

    console.log("awaiting restart...")
    console.log(await restart())
    console.log("awaiting createImages...")
    console.log(await createImages())
    
    /**
     * Get all the folder names in the images directory.
     * Assumes that all files in the images directory are folders.
     */
    
}
export default DB_RESTART

const restart = async() => { 
    await sql`DROP TABLE IF EXISTS images`
    return await sql`
        CREATE TABLE images (
            id              SERIAL PRIMARY KEY,
            artist          TEXT                NOT NULL,
            tweetID         BIGINT              NOT NULL,
            seriesNumber    INT                 NOT NULL,
            URL             TEXT                NOT NULL,
            extension       TEXT                NOT NULL,
            year            INT                 NOT NULL,
            month           INT                 NOT NULL,
            day             INT                 NOT NULL,
            hour            INT                 NOT NULL,
            minute          INT                 NOT NULL,
            second          INT                 NOT NULL,
            timezone        TEXT                NOT NULL
        )` // I ain't dealing with a timestamp object.
}

/**
 * Populate the images table with the images in the images directory.
 */
const createImages = async() => {
    for(const folderName of fs.readdirSync(IMAGE_FILEPATH)) {
        const folderPath = path.join(IMAGE_FILEPATH, folderName)
 
        for(const imageName of fs.readdirSync(folderPath)) {
            const image = parseImageName(imageName, folderName, folderPath)
            await sql`
                INSERT INTO images (artist, tweetID, seriesNumber, URL, extension, year, month, day, hour, minute, second, timezone
                    ) VALUES (
                        ${image.artist},
                        ${image.id},
                        ${image.seriesNumber},
                        ${image.URL},
                        ${image.extension},
                        ${image.timestamp.year},
                        ${image.timestamp.month},
                        ${image.timestamp.day},
                        ${image.timestamp.hour},
                        ${image.timestamp.minute},
                        ${image.timestamp.second},
                        ${image.timestamp.timezone}
                        )`
            console.log(`Inserted ${image.artist} ${image.id} into the database`)
        }
    }
}


/**
 * Relies on the assumption that the image name is in the format of: 'artist [YYYY-MM-DD HH:MM:SS XXX] id_seriesNumber.extension'
 * Also relies on the assumption that spaces cannot be in the artist's name. Which is true of Twitter.
 * 
 * Some images are broken, for example, having no file extension. This function will attempt to add a default extension of '.jpg'
 * @param imageName 
 * @param artistFolderName
 */
const parseImageName = (imageName: string, artistFolderName: string, folderPath: string): ImageData => {
    // Split the image name into its parts
    const [artist, unfiltredDate, time, unfilteredTimezone, unfilteredId] = imageName.split(' ')

    // Do basic string processing to remove unwanted characters
    const date = unfiltredDate.slice(1)
    const timezone = unfilteredTimezone.slice(0, -1)
    const idString = unfilteredId.split('_')[0]
    const seriesNumberString = unfilteredId.split('_')[1].split('.')[0]
    const extension = unfilteredId.split('.')[1]

    if(extension === undefined) {
        console.log(`No extension found for ${imageName}. Adding default extension of '.jpg'`)
        fs.renameSync(path.join(folderPath, imageName), path.join(folderPath, imageName + '.jpg'))
    }

    // Create a timestamp object with additional processing
    const [year, month, day] = date.split('-')
    const [hour, minute, second] = time.split('ː') // Yeah so its not a colon. It's a ː. Thanks Twitter.
    const timestamp = {
        year: Number(year),
        month: Number(month),
        day: Number(day),
        hour: Number(hour),
        minute: Number(minute),
        second: Number(second),
        timezone
    }

    // Convert the id and series number to numbers
    const id = Number(idString)
    const seriesNumber = Number(seriesNumberString)

    const URL = path.join(IMAGE_FILEPATH, artistFolderName, imageName) // artistFolderName is used since folder naming might not match artist name

    return { artist, timestamp, id, seriesNumber, extension, URL }
}
