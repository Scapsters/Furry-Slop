import React from 'react';
import { Post } from './Post';
import { Menu } from './Menu';

export const Home = () => {
    return (
        <div className='strictFit'>
            <Post/>
            <Menu/>
        </div>
    )
}