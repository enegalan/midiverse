import { useEffect, useState } from "react";
import { IconButton } from "@/Components/Buttons";
import { FiSettings } from "react-icons/fi";
import { BsSendPlus } from "react-icons/bs";
import { MdInfoOutline } from "react-icons/md";
import { BackButton } from "@/Components/Buttons";
import { Link } from "@inertiajs/react";

export default function MessagesRightTopNavbar({ user = null, onInfoClick = () => {}, onBack = () => {} }) {
    const handleInfo = (e) => {
        e.preventDefault();
        onInfoClick();
    }
    const handleBack = (e) => {
        e.preventDefault();
        onBack()
    }
    return (
        <>
            <nav className='absolute flex items-center top-0 w-full backdrop-blur-md z-50'>
                <div className='bg-white/65 flex gap-6 items-center w-full'>
                    <div className='flex items-start w-full justify-between px-3 py-3'>
                        <div className='flex items-center gap-2'>
                            <div className='mr-4 inline-flex lg:hidden'>
                                <BackButton onClick={handleBack} />
                            </div>
                            <Link href={`/u/${user.username}`}>
                                <img className='rounded-full w-8' src={user.avatar} alt={user.username} />
                            </Link>
                            <h2 className='text-lg font-bold'>{user.name} {user.lastname ?? ''}</h2>
                        </div>
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