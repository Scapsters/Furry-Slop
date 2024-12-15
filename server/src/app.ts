import express, { Request, Response } from 'express';
import https from 'https';
import http from 'http';
import { DB_RESTART } from './db/db.ts';
import path from 'path';
import cors from 'cors';

import { getPostForTweetID, getRandomTweetData, makePath } from './images.ts';
import AbsolutePathToRepositoryRoot from './AbsolutePathToRepositoryRoot.ts';
import type TweetData from '../../interfaces/TweetData.ts';
import fs from 'fs';

// Set to false for deployment
const DEV = true;
const port = DEV ? 5000 : 80;

// Set to true to RESET THE DATABASE. TURN IT OFF AFTER
const RESET_DATABASE = false;

const options = {
        key: fs.readFileSync(makePath('/ssl certificates/furryslop.com-key.pem')),
        cert: fs.readFileSync(makePath('/ssl certificates/furryslop.com-crt.pem')),
        ca: fs.readFileSync(makePath('/ssl certificates/furryslop.com-chain-only.pem'))
    };

const buildPath = path.join(AbsolutePathToRepositoryRoot, 'client', 'build');
const RandomTweetData = async (_: Request, res: Response) => { res.send(await getRandomTweetData()); };

const Tweets = async (req: Request, res: Response) => { 
    const tweetid = req.params.tweetid
    console.log(req.ip)
    console.log(tweetid)

    if(tweetid === undefined)    { res.send({ response: "No body" }); return }
    if(!/^\d+$/.test(tweetid))   { res.send({ response: "Invalid tweetid" }); return }

    const tweetData: TweetData = await getPostForTweetID(tweetid)
    res.send(tweetData)
}


const app = express()
    .use(cors())
    .use('/.well-known/acme-challenge', express.static(makePath('/.well-known/acme-challenge')))    // HTTPS Certificate Renewal
    .use(express.static(buildPath))         // Host the prod build of the site                                                   
    .get('/', express.static(buildPath))    // Serve the prod build                                                      
    .get('/RandomTweetData', RandomTweetData)
    .get('/Tweets/:tweetid', Tweets)

if (DEV) {
    app.listen(port, '0.0.0.0', () => {
        console.log(`Dev server running on http://localhost:${port}`);
    });
} else {
    https.createServer(options, app).listen(443, '0.0.0.0', () => {
        console.log(`Server is running on port 443 (HTTPS)`);
    });

    http.createServer((req, res) => {
        res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
        res.end();
    }).listen(80, () => {
        console.log('HTTP server is redirecting to HTTPS');
    });
}

if (RESET_DATABASE) {
    console.log("Resetting the database")
    DB_RESTART()
}