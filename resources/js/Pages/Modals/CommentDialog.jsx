import BaseDialog from './BaseDialog';
import { AuthButton } from '@/Components/Buttons';
import { closeModal } from '@/Functions';
import { useEffect } from 'react';
import { useState } from 'react';
import CommentCard from '@/Components/Cards/CommentCard';
import PostCard from '@/Components/Cards/PostCard';
import PostEditor from '@/Components/PostEditor';

export default function CommentDialog({ auth_user, user, post, comment = null, reply = false }) {
    const handleSubmit = (value, visibility, media) => {
        const formData = new FormData();
        if (!value) value = '';
        // In the post comments gerarchy the first comment is always (parent_id = null)
        formData.append('content', value);
        formData.append('visibility', visibility);
        media.forEach((file) => {
            formData.append('media[]', file.file);
        });
        if (reply && comment) {
            formData.append('parent_id', comment.id);
        }
        axios.post('/post/' + post.token + '/comment', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        .then(data => {
            window.location.reload();
        });
    }
    return (
        <BaseDialog miniDialog={true} closeButton={true} width='650px' id={'comment-dialog'}>
            <div className='flex flex-col gap-3 justify-between pb-2 rounded-t w-full'>
                {comment ? (
                    <CommentCard auth_user={auth_user} user={user} post={post} controls={false} comment={comment} />
                ) : (
                    <PostCard controls={false} auth_user={user} post={post} border={false} redirect={false} />
                )}
                <PostEditor padding={false} border={false} onSubmit={handleSubmit} action={`/post/${post?.token}/comment`} buttonText='Reply' placeholder='Post your reply' user={user} />
            </div>
        </BaseDialog>
    );
}
