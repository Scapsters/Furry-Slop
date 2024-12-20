import express, { Request, Response } from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import cors from 'cors';

import { DEV, RESET_DATABASE, DEV_PORT, ALLOWED_ORIGIN, GET_SITE as SEND_SITE, BUILD_PATH } from './dev.ts';
import { getPostForTweetID, getRandomTweetData, getImageForTweetID, makePath } from './tweets.ts';
import type { TweetData} from '../../interfaces/TweetData.ts';
import { DB_RESTART } from './db/db.ts';
import { TweetsForScrapers } from './crawler.ts';

const options = {
    key: fs.readFileSync(makePath('/ssl certificates/furryslop.com-key.pem')),
    cert: fs.readFileSync(makePath('/ssl certificates/furryslop.com-crt.pem')),
    ca: fs.readFileSync(makePath('/ssl certificates/furryslop.com-chain-only.pem'))
};

const RandomTweetData = async (_: Request, res: Response) => { res.send(await getRandomTweetData()); };

const Tweets = async (req: Request, res: Response) => { 
    const tweetid = req.params.tweetid

    if(tweetid === undefined)    { res.send({ response: "No body" }); return }
    if(!/^\d+$/.test(tweetid))   { res.send({ response: "Invalid tweetid" }); return }

    const tweetData: TweetData = await getPostForTweetID(tweetid)
    res.send(tweetData)
}

const Images = async (req: Request, res: Response) => {
    const tweetid = req.params.tweetid

    if(tweetid === undefined)    { res.send({ response: "No body" }); return }
    if(!/^\d+$/.test(tweetid))   { res.send({ response: "Invalid tweetid" }); return }

    const tweetData: string = await getImageForTweetID(tweetid)
    res.send(tweetData)
}

const app = express()
    .use(cors({ origin: ALLOWED_ORIGIN }))
    .use(express.static(BUILD_PATH))
    .use((req, _, next) => { console.log(`Request received: ${req.method} ${req.path} ${req.url}`); next(); })
    .use('/.well-known/acme-challenge', express.static(makePath('/.well-known/acme-challenge'))) // For SSL certificate                                             
    .get('/Api/RandomTweetData', RandomTweetData)
    .get('/Api/Tweets/:tweetid', Tweets)
    .get('/Api/Images/:tweetid', Images)
    .get('/Tweets/:tweetid', TweetsForScrapers)
    .get('*', async (_: Request, res: Response) => { SEND_SITE(res) })

if (DEV) {
    app.listen(DEV_PORT, '0.0.0.0', () => { console.log(`Dev server running on http://localhost:${DEV_PORT}`) })
} else {
    https.createServer(options, app).listen(443, '0.0.0.0', () => { console.log(`Server is running on port 443 (HTTPS)`) })

    http.createServer((req, res) => {
        const host = req.headers.host ?? '';
        res.writeHead(301, { Location: `https://${host.replace(/^www\./, '')}${req.url}` }).end()
    }).listen(80, () => {
        console.log('HTTP server is redirecting to HTTPS');
    });
}

if (RESET_DATABASE) {
    console.log("Resetting the database")
    DB_RESTART()
}
