import express, { Request, Response } from 'express';
import DB_RESTART from './db.ts';
import path from 'path';

import getRandomImage, { makePath } from './images.ts';
import AbsolutePathToRepositoryRoot from './AbsolutePathToRepositoryRoot.ts';

// Set to false for deployment
const DEV = true;
const port = DEV ? 5000 : 80;

// Set to true to RESET THE DATABASE. TURN IT OFF AFTER
const RESET_DATABASE = false;

const buildPath = path.join(AbsolutePathToRepositoryRoot, 'client', 'build');
const RandomImage = (_, res: Response): void => res.sendFile(getRandomImage())

express()
    .use('/.well-known/acme-challenge', express.static(makePath('/.well-known/acme-challenge')))
    .use(express.static(buildPath))
    .get('/', express.static(buildPath))
    .get('/RandomImage', RandomImage)
    .listen(port, '0.0.0.0', () => {console.log(`Server is running on port ${port}`)})

if (RESET_DATABASE) {
    console.log("Resetting the database")
    DB_RESTART()
}