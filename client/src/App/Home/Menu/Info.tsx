import React, { useContext } from 'react';
import './Info.css';

import { postContext } from '../../Home.tsx';

export const Info = () => {
    const postInfo = useContext(postContext)
    return (
        <div>
            <div>
                <span className='display'>{postInfo.owner_display_name}</span>
                <span className='user'><a href={`https://x.com/${postInfo.owner_screen_name}`} >@{postInfo.owner_screen_name}</a></span>
            </div>
            <span className='body'>{postInfo.tweet_text}</span>
        </div>
    )
}