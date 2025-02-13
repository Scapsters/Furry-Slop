import React from 'react';
import { Info } from './Menu/Info.tsx';
import { Refresh } from './Menu/Refresh.tsx';
import { Settings } from './Menu/Settings.tsx';
import './Menu.css';

export const Menu = () => {
    return (
        <div className='evenly-spaced-row menu'>
            <Info/>
            <Refresh/>
            <Settings/>
        </div>
    )
}