import { useEffect, useState } from "react";
import { IconButton } from "../Buttons";
import { FiSettings } from "react-icons/fi";

export default function NotificationsNavbar({ user = null }) {
    const userFullName = user.name + (user.lastname !== '' && user.lastname !== null ? ' ' + user.lastname : '');
    return (
        <>
            <nav className='sticky flex items-center top-0 z-50 w-full backdrop-blur-md border-b border-gray-200/50'>
                <div className='bg-white/85 flex gap-6 items-center w-full'>
                    <div className='flex items-center w-full justify-between hover:cursor-pointer px-5 py-3'>
                        <h2 className='text-lg font-bold'>Notifications</h2>
                        <IconButton href='/settings/notifications' className='text-xl border-none hover:bg-[var(--hover-light)]'>
                            <FiSettings />
                        </IconButton>
                    </div>
                </div>
            </nav>
        </>
    );
}