import React, { useState } from 'react';
import CommentCard from './Cards/CommentCard';
import axios from 'axios';
import PostEditor from './PostEditor';

const Comments = ({ auth_user, user, post, parent_id = null, comments }) => {
    const handleSubmit = (value, visibility, media) => {
        const formData = new FormData();
        if (!value) value = '';
        formData.append('content', value);
        formData.append('visibility', visibility);
        media.forEach((file) => {
            formData.append('media[]', file.file);
        });
        if (parent_id) {
            formData.append('parent_id', parent_id);
        }
        axios.post('/post/' + post.token + '/comment', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(data => {
            window.location.reload();
        });
    }
    return (
        <div>
            <PostEditor onSubmit={handleSubmit} action={`/post/${post?.token}/comment`} buttonText='Reply' placeholder='Post your reply' user={user} />
            <ul>
                {comments && comments.length > 0 && comments.map((comment) => (
                    <CommentCard auth_user={auth_user} post={post} user={comment.user} key={comment.id} comment={comment} />
                ))}
            </ul>
        </div>
    );
};

export default Comments;
