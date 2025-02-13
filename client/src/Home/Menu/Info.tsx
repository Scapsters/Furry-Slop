import React from 'react';

import { PostInfo } from '../../Home.tsx';

export const Info = (postInfo) => {
    const post = postInfo.postInfo as PostInfo;
    return (
        <div>
            <p>{post.displayName}</p>
            <p>{post.userName}</p>
            <p>{post.body}</p>
        </div>
    )
}