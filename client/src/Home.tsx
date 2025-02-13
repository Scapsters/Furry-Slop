import React from 'react';
import { Menu } from './Home/Menu.tsx';
import './Home.css';

export const Home = () => {
    const src = 'https://pbs.twimg.com/media/Ga3S0QKbgAA0Xit?format=jpg&name=orig'
    const postInfo: PostInfo = {
        displayName: 'Slop',
        userName: '@slop',
        body: 'This is a post.'
    }
    
    return (
        <div className='screenfit'>
            <div>
                <img className='post' src={src} alt='slop'></img>
            </div>
            <Menu postInfo={postInfo}/>
        </div>
    )
}

export type PostInfo = {
    displayName: string,
    userName: string,
    body: string
}