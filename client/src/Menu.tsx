import React from 'react';
import { Post } from './Post';
import { Refresh } from './Refresh';
import { Settings } from './Settings';

export const Menu = () => {
    return (
        <div>
            <Post/>
            <Refresh/>
            <Settings/>
        </div>
    )
}