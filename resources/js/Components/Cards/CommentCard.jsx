import React, { useState } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/inertia-react';
import { FaRegComment } from 'react-icons/fa6';
import { IoIosHeart } from 'react-icons/io';
import { IoIosHeartEmpty } from 'react-icons/io';
import { FaBookmark } from 'react-icons/fa';
import { FaRegBookmark } from 'react-icons/fa';
import { IoShare } from 'react-icons/io5';
import { IoShareOutline } from 'react-icons/io5';
import { formatDateForPublic, openModal } from '@/Functions';
import CommentDialog from '@/Pages/Modals/CommentDialog';

export default function CommentCard({ user, comment, post, controls = true, redirect = true }) {
    // Check if the comment is liked by the authenticated user
    const isLiked = user && user.comment_given_likes.some(like => like.comment_id === comment.id);

    const handleUserProfileRedirect = (e) => {
        e.preventDefault();
        window.location.href = `/u/${comment?.user?.username}`;
    }
    const handleReply = (e) => {
        e.stopPropagation();
        openModal('comment-dialog', <CommentDialog reply={true} post={post} comment={comment} user={user} />)
    }
    const handleLike = async (e) => {
        e.stopPropagation();
        try {
            // Send a POST request to like/unlike the post
            await axios.post(`/comment/like/${comment.token}`);
            // Reload the page after successful like/unlike
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }
    const handleBookmark = (e) => {
        e.stopPropagation();
        // Your bookmark handling logic here
    }
    const handleShare = (e) => {
        e.stopPropagation();
        // Your share handling logic here
    }
    const handleCommentRedirect = () => {
        window.location.href = `/comment/${comment.token}`;
    }
    return (
        <article onClick={redirect ? handleCommentRedirect : () => { }} className={`flex gap-2 p-3 w-full transition duration-300 ${redirect ? 'hover:cursor-pointer hover:bg-[var(--hover-light)]' : ''}`} style={{ marginLeft: comment.parent_id ? '20px' : '0' }}>
            <div>
                {redirect ? (
                    <Link onClick={handleUserProfileRedirect} >
                        <img className='w-10 min-w-10 rounded-full' src={comment?.user?.avatar} alt={`${comment?.user?.username} avatar`} />
                    </Link>
                ) : (
                    <span>
                        <img className='w-10 min-w-10 rounded-full' src={comment?.user?.avatar} alt={`${comment?.user?.username} avatar`} />
                    </span>
                )}
            </div>
            <div className='flex flex-col items-start gap-2 w-full'>
                <div className='flex flex-col w-full'>
                    <div className='flex gap-1 items-center'>
                        {redirect ? (
                            <>
                                <Link onClick={handleUserProfileRedirect} className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px] font-bold hover:underline hover:cursor-pointer'>{comment?.user?.name + ' ' + comment?.user?.lastname}</Link>
                                <Link onClick={handleUserProfileRedirect} className='text-sm text-gray-400'>
                                    <label className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px] hover:cursor-pointer'>{'@' + comment?.user?.username}</label>
                                    <label className='hover:cursor-pointer'> · </label>
                                    <label className='hover:cursor-pointer'>{formatDateForPublic(comment?.created_at)}</label>
                                </Link>
                            </>
                        ) : (
                            <>
                                <span className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px] font-bold'>{comment?.user?.name + ' ' + comment?.user?.lastname}</span>
                                <span className='text-sm text-gray-400'>
                                    <label className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px]'>{'@' + comment?.user?.username}</label>
                                    <label className=''> · </label>
                                    <label className=''>{formatDateForPublic(comment?.created_at)}</label>
                                </span>
                            </>
                        )}

                    </div>
                </div>
                <p className='text-sm'>{comment.body}</p>
                {controls && (
                    <div className={`flex w-full items-center flex-wrap gap-6 py-1 xl:gap-24 mt-5 justify-center`}>
                        <div onClick={handleReply} className={`flex py-3 items-center gap-1 xl:gap-2 px-3 relative transition hover:cursor-pointer rounded-full hover:bg-[var(--hover-blue)] hover:text-[var(--blue)]`}>
                            <FaRegComment className='text-md' />
                            <span className='absolute -right-4'>{comment?.replies?.length}</span>
                        </div>
                        <div onClick={handleLike} className={`flex py-[0.60rem] items-center gap-1 xl:gap-2 px-[0.6rem] relative transition hover:cursor-pointer rounded-full hover:bg-[var(--hover-like-red)] hover:text-[var(--like-red)]`}>
                            {isLiked ? (
                                <IoIosHeart className='text-[var(--red)] text-xl hover:cursor-pointer rounded-full' />
                            ) : (
                                <IoIosHeartEmpty className='text-xl hover:cursor-pointer rounded-full' />
                            )}
                            <span className='absolute -right-4'>{comment?.likes?.length}</span>
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
                )}
            </div>
        </article>
    );
};