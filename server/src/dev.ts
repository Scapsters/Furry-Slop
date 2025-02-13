import type { Response } from 'express';
import path from 'path';

// React's build folder
export const BUILD_PATH = 'C:/Users/Scott/Code/furryslop.com prod/client/build'
// False for deployment
export const DEV = true;
// True to create / reset the database. Turn it off after
export const RESET_DATABASE = false;
// React's dev server port
export const CLIENT_DEV_PORT = 3000;
// Server's dev port
export const DEV_PORT = 5000;

export const ALLOWED_ORIGIN = DEV ?
    `http://localhost:${CLIENT_DEV_PORT}` :
    'https://furryslop.com';

export const GET_SITE = DEV ?
    async (res: Response) => {
        console.log("Serving index.html from dev server")
        res.send(await fetch(`http://localhost:${CLIENT_DEV_PORT}`).then((res) => res.text()))
    } :
    (res: Response) => {
        console.log("Serving index.html from buildPath")
        res.sendFile(path.join(BUILD_PATH, 'index.html'))
    }