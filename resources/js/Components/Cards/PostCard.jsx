import { FaRegComment } from 'react-icons/fa6';
import { IoIosHeart } from 'react-icons/io';
import { IoIosHeartEmpty } from 'react-icons/io';
import { FaBookmark } from 'react-icons/fa';
import { FaRegBookmark } from 'react-icons/fa';
import { IoShare } from 'react-icons/io5';
import { IoShareOutline } from 'react-icons/io5';
import { openModal } from '@/Functions';
import CommentDialog from '@/Pages/Modals/CommentDialog';
import { formatDateForPublic } from '@/Functions';
import { FiLink } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { useState, useEffect } from 'react';

import axios from 'axios';
import { Link } from '@inertiajs/inertia-react';

export default function PostCard({ post = null, auth_user = null, redirect = true, separators = false, border = true, controls = true }) {
    const [shareDropdownVisible, setShareDropdownVisible] = useState(false);
    // Check if the post is liked by the authenticated user
    const isLiked = auth_user && auth_user.post_given_likes.some(like => like.post_id === post.id);
    const isBookmarked = auth_user && auth_user.post_bookmarks?.some(bookmark => bookmark.id === post.id);
    // Event handlers
    const handleComment = (e) => {
        e.stopPropagation();
        openModal('comment-dialog', <CommentDialog reply={false} post={post} user={auth_user} />)
    }

    const handleLike = async (e) => {
        e.stopPropagation();
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
        e.stopPropagation();
        try {
            axios.post(`/user/bookmark/${post.token}`);
            // Reload the page after successful bookmark
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }

    const handleShare = (e) => {
        e.stopPropagation();
        setShareDropdownVisible(!shareDropdownVisible);
    }

    const handleUserProfileRedirect = (e) => {
        e.stopPropagation();
        window.location.href = `/u/${post?.user?.username}`;
    }

    const handlePostClick = (e) => {
        e.stopPropagation();
        window.location.href = `/post/${post?.token}`;
    }

    // Close all dropdowns when click on outside a dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdownElements = document.querySelectorAll(".dropdown");
            let outsideClick = true;
            for (let dropdown of dropdownElements) {
                if (dropdown.contains(event.target)) {
                    outsideClick = false;
                }
            }
            if (outsideClick) {
                setShareDropdownVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [shareDropdownVisible]);
    const handleCopyLink = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const postUrl = window.location.origin + '/post/' + post?.token;
        navigator.clipboard.writeText(postUrl);
        setShareDropdownVisible(false);
    }
    return (
        <article onClick={redirect ? handlePostClick : () => { }} className={`${border ? 'border-t' : ''} flex p-3 gap-2 justify-start transition duration-300 ${redirect && 'hover:bg-[var(--hover-light)] hover:cursor-pointer'}`} key={post?.id}>
            <div>
                {redirect ? (
                    <Link onClick={handleUserProfileRedirect} >
                        <img className='w-10 min-w-10 rounded-full' src={post?.user?.avatar} alt={`${post?.user?.username} avatar`} />
                    </Link>
                ) : (
                    <span >
                        <img className='w-10 min-w-10 rounded-full' src={post?.user?.avatar} alt={`${post?.user?.username} avatar`} />
                    </span>
                )}
            </div>
            <div className='flex flex-col w-full'>
                <div className='flex gap-1 items-center'>
                    {redirect ? (
                        <>
                            <Link onClick={handleUserProfileRedirect} className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px] font-bold hover:underline hover:cursor-pointer'>{post?.user?.name + ' ' + post?.user?.lastname}</Link>
                            <Link onClick={handleUserProfileRedirect} className='text-sm text-gray-400'>
                                <label className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px] hover:cursor-pointer'>{'@' + post?.user?.username}</label>
                                <label className='hover:cursor-pointer'> · </label>
                                <label className='hover:cursor-pointer'>{formatDateForPublic(post?.created_at)}</label>
                            </Link>
                        </>
                    ) : (
                        <>
                            <span className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px] font-bold'>{post?.user?.name + ' ' + post?.user?.lastname}</span>
                            <span className='text-sm text-gray-400'>
                                <label className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px]'>{'@' + post?.user?.username}</label>
                                <label className=''> · </label>
                                <label className=''>{formatDateForPublic(post?.created_at)}</label>
                            </span>
                        </>
                    )}
                </div>
                <div className='flex flex-col justify-center'>
                    <span className='text-sm' style={{ overflowWrap: 'anywhere' }}>{post?.content}</span>
                    {separators && controls && (<div className="border-t mt-5 border-gray-100 flex-grow"></div>)}
                    {controls && (
                        <div className={`flex flex-wrap gap-6 py-1 xl:gap-24 ${!separators && 'mt-5'} justify-center`}>
                            <div onClick={handleComment} className={`flex items-center gap-1 xl:gap-2 px-3 relative transition hover:cursor-pointer rounded-full hover:bg-[var(--hover-blue)] hover:text-[var(--blue)]`}>
                                <FaRegComment className='text-md' />
                                <span className='absolute -right-4'>{post?.comments?.length}</span>
                            </div>
                            <div onClick={handleLike} className={`flex items-center gap-1 xl:gap-2 px-[0.6rem] relative transition hover:cursor-pointer rounded-full hover:bg-[var(--hover-like-red)] hover:text-[var(--like-red)]`}>
                                {isLiked ? (
                                    <IoIosHeart className='text-[var(--red)] text-xl hover:cursor-pointer rounded-full' />
                                ) : (
                                    <IoIosHeartEmpty className='text-xl hover:cursor-pointer rounded-full' />
                                )}
                                <span className='absolute -right-4'>{post?.likes?.length}</span>
                            </div>
                            <div className='flex items-center gap-3 xl:gap-6'>
                                <div onClick={handleBookmark} className={`p-3 relative transition hover:cursor-pointer rounded-full hover:bg-[var(--hover-blue)] hover:text-[var(--blue)]`}>
                                    {isBookmarked ? (
                                        <FaBookmark className='text-md text-[var(--blue)]' />
                                    ) : (
                                        <FaRegBookmark className='text-md' />
                                    )}
                                </div>
                                <div className='relative'>
                                    <div onClick={handleShare} className={`p-2 px-[0.6rem] relative transition hover:cursor-pointer rounded-full hover:bg-[var(--hover-blue)] hover:text-[var(--blue)]`}>
                                        <IoShareOutline className='text-xl mb-1' />
                                    </div>
                                    {shareDropdownVisible && (
                                        <section className='dropdown absolute top-12 -left-4'>
                                            <div className='absolute -top-40 left-4 min-w-[270px] bg-white rounded-lg dropdown-shadow py-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <Link onClick={handleCopyLink} className='flex items-center gap-3 font-semibold px-4 py-2 hover:bg-[var(--hover-light)]'>
                                                        <span className='pointer-events-none'><FiLink /></span>
                                                        <span className='pointer-events-none'>Copy link</span>
                                                    </Link>
                                                    <Link className='flex items-center gap-3 font-semibold px-4 py-2 hover:bg-[var(--hover-light)]'>
                                                        <span className='pointer-events-none'><MdOutlineEmail /></span>
                                                        <span className='pointer-events-none'>Send via direct message</span>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="absolute top-[-3.5rem] left-6 w-5 flex justify-center overflow-hidden">
                                                <div className="shadow h-3 w-3 bg-white -rotate-45 transform origin-top-left"></div>
                                            </div>
                                        </section>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {separators && controls && (<div className="border-t border-gray-100 flex-grow"></div>)}
                </div>
            </div>
        </article>
    );
}