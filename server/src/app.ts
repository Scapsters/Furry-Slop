import express, { Request, Response } from 'express';

import getRandomImage, { makePath } from './images.ts';

const DEV = true;
const port = DEV ? 5000 : 80;

const defaultRequest = (req: Request, res: Response): void => {
    console.log("query", req.query);
    console.log("params", req.params);
    console.log("header", req.headers);
    console.log("body", req.body);

    const imagePath = getRandomImage();
    res.sendFile(imagePath);
}

express()
    .use('/.well-known/acme-challenge', express.static(makePath('/.well-known/acme-challenge')))
    .get('/', defaultRequest)
    .listen(port, '0.0.0.0', () => {console.log(`Server is running on port ${port}`)})

