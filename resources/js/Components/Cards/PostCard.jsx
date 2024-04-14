import { FaRegComment } from 'react-icons/fa6';
import { IoIosHeart } from 'react-icons/io';
import { IoIosHeartEmpty } from 'react-icons/io';
import { FaBookmark } from 'react-icons/fa';
import { FaRegBookmark } from 'react-icons/fa';
import { IoShare } from 'react-icons/io5';
import { IoShareOutline } from 'react-icons/io5';

import axios from 'axios';
import { Link } from '@inertiajs/inertia-react';

export default function PostCard({ post = null, auth_user = null }) {
    // Check if the post is liked by the authenticated user
    const isLiked = auth_user && auth_user.post_given_likes.some(like => like.post_id === post.id);

    // Event handlers
    const handleComment = (e) => {
        e.preventDefault();
        // Your comment handling logic here
    }

    const handleLike = async (e) => {
        e.preventDefault();
        try {
            // Send a POST request to like/unlike the post
            await axios.post(`/post/like/${post.id}`);
            // Reload the page after successful like/unlike
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }

    const handleBookmark = (e) => {
        e.preventDefault();
        // Your bookmark handling logic here
    }

    const handleShare = (e) => {
        e.preventDefault();
        // Your share handling logic here
    }

    const handleUserProfileRedirect = (e) => {
        e.preventDefault();
        window.location.href = `/u/${post?.user?.username}`;
    }

    return (
        <article className='border-t flex p-3 gap-2 justify-start' key={post?.id}>
            <div>
                <Link onClick={handleUserProfileRedirect} >
                    <img className='w-10 min-w-10 rounded-full' src={post?.user?.avatar} alt={`${post?.user?.username} avatar`} />
                </Link>
            </div>
            <div className='flex flex-col w-full'>
                <div className='flex gap-1 items-center'>
                    <Link onClick={handleUserProfileRedirect} className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px] font-bold hover:underline hover:cursor-pointer'>{post?.user?.name + ' ' + post?.user?.lastname}</Link>
                    <Link onClick={handleUserProfileRedirect} className='text-sm text-gray-400'>
                        <label className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px] hover:cursor-pointer'>{'@' + post?.user?.username}</label>
                        <label className='hover:cursor-pointer'> · </label>
                        <label className='hover:cursor-pointer'>{post?.date}</label>
                    </Link>
                </div>
                <div className='flex flex-col justify-center'>
                    <span className='text-sm' style={{ overflowWrap: 'anywhere' }}>{post?.content}</span>
                    <div className='flex flex-wrap gap-6 xl:gap-24 mt-5 justify-center'>
                        <div onClick={handleComment} className={`flex items-center gap-1 xl:gap-2 px-3 relative transition hover:cursor-pointer rounded-full hover:bg-[var(--hover-blue)] hover:text-[var(--blue)]`}>
                            <FaRegComment className='text-md' />
                            <span className='absolute -right-4'>{post?.comments.length}</span>
                        </div>
                        <div onClick={handleLike} className={`flex items-center gap-1 xl:gap-2 px-[0.6rem] relative transition hover:cursor-pointer rounded-full hover:bg-[var(--hover-like-red)] hover:text-[var(--like-red)]`}>
                            {isLiked ? (
                                <IoIosHeart className='text-[var(--red)] text-xl hover:cursor-pointer rounded-full' />
                            ) : (
                                <IoIosHeartEmpty className='text-xl hover:cursor-pointer rounded-full' />
                            )}
                            <span className='absolute -right-4'>{post?.likes.length}</span>
                        </div>
                        <div className='flex items-center gap-3 xl:gap-6'>
                            <div onClick={handleBookmark} className={`p-3 relative transition hover:cursor-pointer rounded-full hover:bg-[var(--hover-blue)] hover:text-[var(--blue)]`}>
                                <FaRegBookmark className='text-md' />
                            </div>
                            <div onClick={handleShare} className={`p-2 px-[0.6rem] relative transition hover:cursor-pointer rounded-full hover:bg-[var(--hover-blue)] hover:text-[var(--blue)]`}>
                                <IoShareOutline className='text-xl mb-1' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}