import { useEffect, useState } from "react";
import { IconButton } from "../Buttons";
import { FiSettings } from "react-icons/fi";

export default function BookmarksTopNavbar({ user = null }) {
    return (
        <>
            <nav className='sticky flex items-center top-0 w-full backdrop-blur-md border-b border-gray-200/50'>
                <div className='bg-white/25 flex gap-6 items-center w-full'>
                    <div className='flex flex-col items-start w-full justify-between hover:cursor-pointer px-5 py-3'>
                        <h2 className='text-lg font-bold'>Bookmarks</h2>
                        <span className='text-sm text-[var(--grey)]'>@{user.username}</span>
                    </div>
                </div>
            </nav>
        </>
    );
}