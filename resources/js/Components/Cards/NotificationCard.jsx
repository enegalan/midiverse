import { FaRegComment } from 'react-icons/fa6';
import { IoIosHeart } from 'react-icons/io';
import { IoIosHeartEmpty } from 'react-icons/io';
import { FaBookmark } from 'react-icons/fa';
import { FaRegBookmark } from 'react-icons/fa';
import { IoShare } from 'react-icons/io5';
import { IoShareOutline } from 'react-icons/io5';
import { CloseButton } from '../Buttons';

import axios from 'axios';
import { Link } from '@inertiajs/react';
import { AuthButton } from '../Buttons';

// 0 => Follow
// 1 => Like
// 2 => Bookmark
// 3 => Comment
// 4 => Rol
// 5 => Request Accepted
// 6 => Invites
// TODO: Change SVGs
const types = {
    0: <svg viewBox="0 0 24 24" aria-hidden="true" className=''><g><path d="M22.99 11.295l-6.986-2.13-.877-.326-.325-.88L12.67.975c-.092-.303-.372-.51-.688-.51-.316 0-.596.207-.688.51l-2.392 7.84-1.774.657-6.148 1.82c-.306.092-.515.372-.515.69 0 .32.21.6.515.69l7.956 2.358 2.356 7.956c.09.306.37.515.69.515.32 0 .6-.21.69-.514l1.822-6.15.656-1.773 7.84-2.392c.303-.09.51-.37.51-.687 0-.316-.207-.596-.51-.688z" fill="#794BC4"></path></g></svg>,
    1: <svg viewBox="0 0 24 24" aria-hidden="true" className='fill-[var(--main-blue)]'><g><path d="M21 12L4 2v20l17-10z"></path></g></svg>,
    2: <svg viewBox="0 0 24 24" aria-hidden="true" className='fill-[var(--main-blue)]'><g><path d="M21 12L4 2v20l17-10z"></path></g></svg>,
    3: <svg viewBox="0 0 24 24" aria-hidden="true" className='fill-[var(--main-blue)]'><g><path d="M21 12L4 2v20l17-10z"></path></g></svg>,
    4: <svg viewBox="0 0 24 24" aria-hidden="true" className='fill-[var(--main-blue)]'><g><path d="M21 12L4 2v20l17-10z"></path></g></svg>,
    5: <svg viewBox="0 0 24 24" aria-hidden="true" className='fill-[var(--main-blue)]'><g><path d="M21 12L4 2v20l17-10z"></path></g></svg>,
    6: <svg viewBox="0 0 24 24" aria-hidden="true" className='fill-[var(--main-blue)]'><g><path d="M21 12L4 2v20l17-10z"></path></g></svg>,
};

export default function NotificationCard({ notification = null }) {
    const handleProfileRedirect = (e) => {
        e.preventDefault();
        window.location.href = `/u/${notification?.from_user?.username}`;
    }

    const handleDeleteNotification = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('id', notification.id);
        if (notification.group_id) {
            axios.post('/group/notification/delete', formData)
            .then(data => window.location.reload());
        } else {
            axios.post('/user/notification/delete', formData)
            .then(data => window.location.reload());
        }
    }

    const handleAcceptFollow = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('user_id', notification.from_user_id);
        if (notification.group_id) {
            formData.append('group_id', notification.group_id);
            if (notification.type == 6) {
                axios.post('/group/request/invite/accept', formData)
                .then(data => window.location.reload());
            } else if (notification.type == 0) {
                axios.post('/group/request/follow/accept', formData)
                .then(data => window.location.reload());
            }
        } else if (notification.user_id) {
            if (notification.type == 6) {
                formData.append('notification_id', notification.id);
                axios.post('/group/request/invite/accept', formData)
                .then(data => window.location.reload())
            } else {
                axios.post('/user/request/follow/accept', formData)
                .then(data => window.location.reload())
            }
        }
    }
console.log(notification.type);
    return (
        <article className='flex relative' key={notification?.id}>
            <Link href={`/u/${notification.from_user?.username}`} className='w-full border-t flex p-3 gap-2 justify-start relative transition duration-300 hover:bg-[var(--hover-light)]'>
                <div className='w-7 pt-2'>
                    {types[notification.type]}
                </div>
                <div>
                    <div>
                        <span onClick={handleProfileRedirect} className='hover:cursor-pointer'>
                            <img className='w-10 min-w-10 rounded-full' src={notification?.from_user?.avatar} alt={`${notification?.from_user?.username} avatar`} />
                        </span>
                    </div>
                    <div className='flex flex-col w-full mt-2'>
                        <div className='flex gap-1 items-center'>
                            <span onClick={handleProfileRedirect} className='text-sm max-w-[100px] lg:max-w-none whitespace-nowrap overflow-hidden overflow-ellipsis font-bold hover:underline hover:cursor-pointer'>{notification?.from_user?.name + ' ' + notification?.from_user?.lastname}</span>
                        </div>
                        <div className='flex flex-col justify-center mt-3'>
                            <span className='text-sm text-[var(--grey)]' style={{ overflowWrap: 'anywhere' }}>{notification?.message}</span>
                        </div>
                    </div>
                </div>
            </Link>
            {(notification.type != 0 && notification.type != 6 && notification.type == 5) && (
                <div className='absolute inline-block right-2 top-1'>
                    <CloseButton onClick={handleDeleteNotification} />
                </div>
            )}
            {(notification.type == 0 || notification.type == 6) && (
                <div className='flex items-center gap-3 absolute right-10 top-10'>
                    <AuthButton onClick={handleAcceptFollow} text='Confirm' className='text-white bg-[var(--main-blue)] transition duration-300 hover:bg-[var(--hover-blue)]' />
                    <AuthButton onClick={handleDeleteNotification} text='Delete' className='text-white bg-[var(--grey)] transition duration-300 hover:bg-[var(--hover-grey)]' />
                </div>
            )}
        </article>
    );
}