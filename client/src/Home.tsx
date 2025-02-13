import React from 'react';
import { Menu } from './Home/Menu.tsx';
import './Home.css';

export const Home = () => {
    const src = 'https://pbs.twimg.com/media/F_ibsdTakAAIrxp?format=jpg&name=orig'
    const postInfo: PostInfo = {
        displayName: 'Slod',
        userName: '@slodddddddd',
        body: 'This is a postdwqq qwdqwdqwd QWD AWEFEARF WERFEQRFGEWRF WERFWERFWERF QWF3EFQWF QWEFF.'
    }

    return (
        <div className='home'>
            <img className='post' src={src} alt='slop'></img>
            <Menu postInfo={postInfo}/>
        </div>
    )
}

export type PostInfo = {
    displayName: string,
    userName: string,
    body: string
}