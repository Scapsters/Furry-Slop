import express, { Request, Response } from 'express';
import path from 'path';

import getRandomImage, { makePath } from './images.ts';
import AbsolutePathToRepositoryRoot from './AbsolutePathToRepositoryRoot.ts';

// Set to false for deployment
const DEV = true;
const port = DEV ? 5000 : 80;

const buildPath = path.join(AbsolutePathToRepositoryRoot, 'client', 'build');
const indexPath = path.join(buildPath, 'index.html');

const defaultRequest = (req: Request, res: Response): void => {
    console.log("query", req.query);
    console.log("params", req.params);
    console.log("header", req.headers);
    console.log("body", req.body);

    const imagePath = getRandomImage();
    res.sendFile(indexPath);
}

express()
    .use('/.well-known/acme-challenge', express.static(makePath('/.well-known/acme-challenge')))
    .use(express.static(buildPath))
    .get('*', express.static(path.join(AbsolutePathToRepositoryRoot, 'client', 'build')))
    .listen(port, '0.0.0.0', () => {console.log(`Server is running on port ${port}`)})

