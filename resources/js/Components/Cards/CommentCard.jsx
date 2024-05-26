import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/inertia-react';
import { FaRegComment } from 'react-icons/fa6';
import { IoIosHeart } from 'react-icons/io';
import { IoIosHeartEmpty } from 'react-icons/io';
import { FaBookmark } from 'react-icons/fa';
import { FaRegBookmark } from 'react-icons/fa';
import { IoShare } from 'react-icons/io5';
import { FiLink } from "react-icons/fi";
import ImagesPreview from '../ImagesPreview';
import { IoShareOutline } from 'react-icons/io5';
import { MdOutlineDelete, MdOutlineEmail, MdOutlineEdit, MdBlock, MdOutlineReport } from "react-icons/md";
import { formatDateForPublic, openModal } from '@/Functions';
import CommentDialog from '@/Pages/Modals/CommentDialog';
import { IconButton } from '../Buttons';
import { BsThreeDots } from 'react-icons/bs';
import { BiVolumeMute } from "react-icons/bi";
import { FaCheck } from 'react-icons/fa6';
import { IoEarthOutline } from 'react-icons/io5';
import ConfirmationDialog from '@/Pages/Modals/ConfirmationDialog';
import EditCommentModal from '@/Pages/Modals/EditCommentModal';

export default function CommentCard({ user, comment, post, controls = true, redirect = true }) {
    const [shareDropdownVisible, setShareDropdownVisible] = useState(false);
    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
    const [whoCanReplyVisible, setWhoCanReplyVisible] = useState(false);
    // Check if the comment is liked by the authenticated user
    const isLiked = user && user.comment_given_likes.some(like => like.comment_id === comment.id);
    const isBookmarked = user && user.comment_bookmarks?.some(bookmark => bookmark.id === comment.id);
    const isFollower = user && user.followings?.some(follower => follower.id === comment.user.id);
    const isOwner = user && user.comments?.some(user_comment => user_comment.id === comment.id);
    const handleUserProfileRedirect = (e) => {
        e.stopPropagation();
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
        try {
            const formData = new FormData();
            formData.append('type', 'comment');
            axios.post(`/user/bookmark/${comment.token}`, formData);
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
    const handleCommentRedirect = (e) => {
        e.stopPropagation();
        window.location.href = `/comment/${comment.token}`;
    }
    const handleCopyLink = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const postUrl = window.location.origin + '/comment/' + comment?.token;
        navigator.clipboard.writeText(postUrl);
        setShareDropdownVisible(false);
    }
    const handleMoreOptions = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMoreOptionsVisible(true);
    }
    const handleToggleFollow = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMoreOptionsVisible(false);
        await axios.post(`/user/follow/${post.user.username}`).then(window.location.reload());
    }
    const handleWhoCanReply = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMoreOptionsVisible(false);
        setWhoCanReplyVisible(true);
    }
    const handleEditComment = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMoreOptionsVisible(false);
        openModal('edit-comment-modal', <EditCommentModal comment={comment} />)
    }
    const handleDeletePost = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMoreOptionsVisible(false);
        openModal('delete-post', <ConfirmationDialog width='350px' className='py-6' buttonClass='bg-[var(--red)] hover:bg-[var(--hover-red)]' id='delete-post' message='Delete post?' buttonText='Delete' getStatus={deletePost} subtitle='This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results. ' />)
    }
    const deletePost = (status) => {
        if (status) axios.delete(`/post/${post.token}`).then(window.location.reload())
    }
    const handleEveryone = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (comment.comments_visibility == 0) return;
        const formData = new FormData();
        formData.append('comment_id', comment.id);
        formData.append('visibility', 0);
        axios.post('/comments/visibility', formData).then(window.location.reload())
    }
    const handleFollowers = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (comment.comments_visibility == 1) return;
        const formData = new FormData();
        formData.append('comment_id', comment.id);
        formData.append('visibility', 1);
        axios.post('/comments/visibility', formData).then(window.location.reload())
    }
    const handleOnlyYou = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (comment.comments_visibility == 2) return;
        const formData = new FormData();
        formData.append('comment_id', comment.id);
        formData.append('visibility', 2);
        axios.post('/comments/visibility', formData).then(window.location.reload())
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
                setMoreOptionsVisible(false);
                setWhoCanReplyVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [shareDropdownVisible]);
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
                    <div className='flex gap-1 items-center justify-between'>
                        {redirect ? (
                            <div className='flex gap-1 items-center'>
                                <Link onClick={handleUserProfileRedirect} className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px] font-bold hover:underline hover:cursor-pointer'>{comment?.user?.name + ' ' + comment?.user?.lastname}</Link>
                                <Link onClick={handleUserProfileRedirect} className='text-sm text-gray-400'>
                                    <label className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px] hover:cursor-pointer'>{'@' + comment?.user?.username}</label>
                                    <label className='hover:cursor-pointer'> · </label>
                                    <label className='hover:cursor-pointer'>{formatDateForPublic(comment?.created_at)}</label>
                                </Link>
                            </div>
                        ) : (
                            <div className='flex gap-1 items-center'>
                                <span className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px] font-bold'>{comment?.user?.name + ' ' + comment?.user?.lastname}</span>
                                <span className='text-sm text-gray-400'>
                                    <label className='whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[105px]'>{'@' + comment?.user?.username}</label>
                                    <label className=''> · </label>
                                    <label className=''>{formatDateForPublic(comment?.created_at)}</label>
                                </span>
                            </div>
                        )}
                        <div className='inline-flex relative'>
                            <IconButton onClick={handleMoreOptions} className='border-none hover:bg-[var(--hover-blue)] hover:text-[var(--blue)]'>
                                <BsThreeDots />
                            </IconButton>
                            {moreOptionsVisible && (
                                <section className='dropdown absolute -top-36 -left-5'>
                                    <div className='absolute top-36 -left-64 min-w-[300px] bg-white rounded-lg dropdown-shadow'>
                                        <div className='flex flex-col'>
                                            {!isOwner && (
                                                <Link onClick={handleToggleFollow} className='flex items-center rounded-t-lg gap-3 font-semibold px-4 py-3 hover:bg-[var(--hover-light)]'>
                                                    <span className='pointer-events-none'><i className={`pi pi-user-${isFollower ? 'minus' : 'plus'}`} /></span>
                                                    <span className='pointer-events-none'>{isFollower ? `Unfollow @${post.user.username}` : `Follow @${post.user.username}`}</span>
                                                </Link>
                                            )}
                                            {isOwner && (
                                                <>
                                                    <Link onClick={handleDeletePost} className='flex text-[var(--red)] items-center gap-3 font-semibold px-4 py-3 hover:bg-[var(--hover-light)]'>
                                                        <span className='pointer-events-none text-lg'><MdOutlineDelete /></span>
                                                        <span className='pointer-events-none'>Delete</span>
                                                    </Link>
                                                    <Link onClick={handleEditComment} className='flex items-center gap-3 font-semibold px-4 py-3 hover:bg-[var(--hover-light)]'>
                                                        <span className='pointer-events-none text-lg'><MdOutlineEdit /></span>
                                                        <span className='pointer-events-none'>Edit</span>
                                                    </Link>
                                                    <Link onClick={handleWhoCanReply} className='flex items-center gap-3 font-semibold px-4 py-3 hover:bg-[var(--hover-light)]'>
                                                        <span className='pointer-events-none text-sm'><FaRegComment /></span>
                                                        <span className='pointer-events-none'>Change who can reply</span>
                                                    </Link>
                                                </>
                                            )}
                                            {!isOwner && (
                                                <>
                                                    <Link className='flex items-center gap-3 font-semibold px-4 py-3 hover:bg-[var(--hover-light)]'>
                                                        <span className='pointer-events-none'><BiVolumeMute /></span>
                                                        <span className='pointer-events-none'>Mute @{post.user.username}</span>
                                                    </Link>
                                                    <Link className='flex items-center gap-3 font-semibold px-4 py-3 hover:bg-[var(--hover-light)]'>
                                                        <span className='pointer-events-none'><MdBlock /></span>
                                                        <span className='pointer-events-none'>Block @{post.user.username}</span>
                                                    </Link>
                                                    <Link className='flex items-center rounded-b-lg gap-3 font-semibold px-4 py-3 hover:bg-[var(--hover-light)]'>
                                                        <span className='pointer-events-none text-lg'><MdOutlineReport /></span>
                                                        <span className='pointer-events-none'>Report post</span>
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            )}
                            {isOwner && whoCanReplyVisible && (
                                <section className='dropdown absolute -top-36 -left-5'>
                                    <div className='absolute top-36 -left-64 min-w-[300px] bg-white rounded-lg dropdown-shadow'>
                                        <div className='flex flex-col'>
                                            <div className='px-4 py-3'>
                                                <h1 className='font-bold text-md'>Who can reply?</h1>
                                                <h3 className='text-sm text-[var(--grey)]'>Choose who can reply to this post. Anyone mentioned can always reply.</h3>
                                            </div>
                                            <Link onClick={handleEveryone} className='flex items-center justify-between font-semibold px-4 py-3 hover:bg-[var(--hover-light)]'>
                                                <div className='flex items-center gap-3'>
                                                    <span className='pointer-events-none bg-[var(--blue)] text-[var(--white)] rounded-full px-3 py-3'><IoEarthOutline /></span>
                                                    <span className='pointer-events-none'>Everyone</span>
                                                </div>
                                                {comment.comments_visibility == 0 && (
                                                    <div className='text-[var(--blue)]'>
                                                        <FaCheck />
                                                    </div>
                                                )}
                                            </Link>
                                            <Link onClick={handleFollowers} className='flex items-center justify-between font-semibold px-4 py-3 hover:bg-[var(--hover-light)]'>
                                                <div className='flex items-center gap-3'>
                                                    <span className='pointer-events-none bg-[var(--blue)] text-[var(--white)] rounded-full px-3 py-2'><i className={`pi pi-users`} /></span>
                                                    <span className='pointer-events-none'>Accounts you follow</span>
                                                </div>
                                                {comment.comments_visibility == 1 && (
                                                    <div className='text-[var(--blue)]'>
                                                        <FaCheck />
                                                    </div>
                                                )}
                                            </Link>
                                            <Link onClick={handleOnlyYou} className='flex items-center rounded-b-lg justify-between font-semibold px-4 py-3 hover:bg-[var(--hover-light)]'>
                                                <div className='flex items-center gap-3'>
                                                    <span className='pointer-events-none bg-[var(--blue)] text-[var(--white)] rounded-full px-3 py-2'><i className={`pi pi-user`} /></span>
                                                    <span className='pointer-events-none'>Only you</span>
                                                </div>
                                                {comment.comments_visibility == 2 && (
                                                    <div className='text-[var(--blue)]'>
                                                        <FaCheck />
                                                    </div>
                                                )}
                                            </Link>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
                <pre className='text-sm' style={{ overflowWrap: 'anywhere' }}>{comment.body && comment.body.trim() != '' ? comment.body : ''}</pre>
                <ImagesPreview media={comment.media}/>
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
            </div>
        </article>
    );
};