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

const isCrawler = (userAgent: string): boolean => {
    const crawlers: string[] = [
        'googlebot', 'bingbot', 'yandex', 'baiduspider', 'discordbot', 'facebookexternalhit'
    ];
    return crawlers.some((crawler) => userAgent.toLowerCase().includes(crawler));
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

interface TweetDataResponse {
    owner_screen_name: string;
    tweet_text: string;
    media_urls?: string;
}

const TweetsForScrapers = async (req: Request, res: Response, next: () => void) => {
    if(req.headers['user-agent'] && isCrawler(req.headers['user-agent'])) {
        const tweetData: TweetDataResponse = await getPostForTweetID(req.params.tweetid);

        const mediaUrl: string =
            tweetData.media_urls === undefined || tweetData.media_urls === '' ?
            'https://furryslop.com/logo192.png' : tweetData.media_urls.split(', ')[0];

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>${tweetData.owner_screen_name}</title>
                <meta name="twitter:site" content="@${tweetData.owner_screen_name}">
                <meta name="twitter:title" content="${tweetData.owner_screen_name}">
                <meta name="twitter:description" content="${tweetData.tweet_text}">
                <meta name="twitter:card" content="summary_large_image">
                <meta name="twitter:image:src" content="${mediaUrl}">
            </head>
            <body>
                <div id="root"></div>
            </body>
            </html>
        `);
    } else {
        next();
    }
}

const app = express()
    .use(cors({ origin: 'https://furryslop.com' }))
    .use(express.static(buildPath)) // Serve static files
    .use('/.well-known/acme-challenge', express.static(makePath('/.well-known/acme-challenge')))    // HTTPS Certificate Renewal         // Host the prod build of the site                                               
    .get('/Api/RandomTweetData', RandomTweetData)
    .get('/Api/Tweets/:tweetid', Tweets)
    .get('/Api/Images/:tweetid', Images)
    .get('/Tweets/:tweetid', TweetsForScrapers)
    
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