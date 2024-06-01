import { useEffect, useState } from "react";
import { IconButton } from "@/Components/Buttons";
import { FiSettings } from "react-icons/fi";
import { BsSendPlus } from "react-icons/bs";
import { MdInfoOutline } from "react-icons/md";

export default function MessagesRightTopNavbar({ user = null }) {
    const handleInfo = (e) => {
        e.preventDefault();
        // TODO
    }
    return (
        <>
            <nav className='absolute flex items-center top-0 w-full backdrop-blur-md z-50'>
                <div className='bg-white/65 flex gap-6 items-center w-full'>
                    <div className='flex items-start w-full justify-between px-3 py-3'>
                        <h2 className='text-lg font-bold'>{user.name} {user.lastname ? user.lastname : ''}</h2>
                        <div className='inline-flex'>
                            <IconButton onClick={handleInfo} className='border-none text-lg hover:bg-[var(--light-grey)]'>
                                <MdInfoOutline />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}