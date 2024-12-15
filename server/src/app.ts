import express, { Request, Response } from 'express';
import https from 'https';
import http from 'http';
import { DB_RESTART } from './db/db.ts';
import path from 'path';
import cors from 'cors';

import { getPostForTweetID, getRandomTweetData, getImageForTweetID, makePath } from './images.ts';
import AbsolutePathToRepositoryRoot from './AbsolutePathToRepositoryRoot.ts';
import type TweetData from '../../interfaces/TweetData.ts';
import fs from 'fs';

// Set to false for deployment
const DEV = false;

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

const Images = async (req: Request, res: Response) => {
    const tweetid = req.params.tweetid
    console.log(tweetid)
    if(tweetid === undefined)    { res.send({ response: "No body" }); return }
    if(!/^\d+$/.test(tweetid))   { res.send({ response: "Invalid tweetid" }); return }

    const tweetData: string = await getImageForTweetID(tweetid)
    res.send(tweetData)
}


const app = express()
    .use(cors({ origin: 'https://furryslop.com' }))
    .use(express.static(buildPath)) // Serve static files
    .use('/.well-known/acme-challenge', express.static(makePath('/.well-known/acme-challenge')))    // HTTPS Certificate Renewal         // Host the prod build of the site                                               
    .get('/Api/RandomTweetData', RandomTweetData)
    .get('/Api/Tweets/:tweetid', Tweets)
    .get('/Api/Images/:tweetid', Images)
    
    app.use((req, res, next) => {
        console.log(`Request received: ${req.method} ${req.path}`);
        console.log(req.query)
        next();
    })
    .get('*', (_: Request, res: Response) => {
        console.log("Serving index.html")
        res.sendFile(path.join(buildPath, 'index.html'));
    })

if (DEV) {
    app.listen(5000, '0.0.0.0', () => {
        console.log(`Dev server running on http://localhost:${5000}`);
    });
} else {
    https.createServer(options, app).listen(443, '0.0.0.0', () => {
        console.log(`Server is running on port 443 (HTTPS)`);
    });

    http.createServer((req, res) => {

        const host = req.headers.host ?? '';
        console.log(host)
        if (host.startsWith('www.')) {
            res.writeHead(301, { Location: `https://${host.replace(/^www\./, '')}${req.url}` });
            res.end();
            return;
        }

        res.writeHead(301, { Location: `https://${host}${req.url}` });
        res.end();
    }).listen(80, () => {
        console.log('HTTP server is redirecting to HTTPS');
    });
}

if (RESET_DATABASE) {
    console.log("Resetting the database")
    DB_RESTART()
}