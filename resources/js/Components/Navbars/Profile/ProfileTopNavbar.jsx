import { useEffect, useState } from "react";
import { BackButton } from "../../Buttons";

export default function ProfileTopNavbar({ user = null }) {
    const userFullName = user.name + (user.lastname !== '' && user.lastname !== null ? ' ' + user.lastname : '');
    return (
        <>
            <nav className='sticky flex items-center top-0 w-full backdrop-blur-md border-b border-gray-200/50'>
                <div className='bg-white/25 flex gap-6 items-center w-full'>
                    <BackButton />
                    <div className='flex flex-col hover:cursor-pointer'>
                        <h2 className='text-lg font-bold'>{userFullName}</h2>
                        <span className='text-xs text-[var(--grey)]'>{user.posts.length} posts</span>
                    </div>
                </div>
            </nav>
        </>
    );
}