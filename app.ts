import express from 'express';

import getRandomImage, { makePath } from './images.ts';

const app = express();
const port = 80;

app.use('/.well-known/acme-challenge', express.static(makePath('/.well-known/acme-challenge')));

app.get('/', (req, res) => {
    console.log(req.query)
    console.log(req.params)
    console.log(req)

    const imagePath = getRandomImage()
    res.sendFile(imagePath);
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
})

