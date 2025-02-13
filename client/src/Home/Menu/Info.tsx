import React from 'react';
import './Info.css';

import { PostInfo } from '../../Home.tsx';

export const Info = (postInfo) => {
    const post = postInfo.postInfo as PostInfo;
    return (
        <div>
            <div>
                <span className='display'>{post.displayName}</span>
                <span className='user'>{post.userName}</span>
            </div>
            <span className='body'>{post.body}</span>
        </div>
    )
}