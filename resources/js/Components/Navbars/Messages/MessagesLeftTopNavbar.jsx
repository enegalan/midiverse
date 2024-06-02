import { useEffect, useState } from "react";
import { IconButton } from "@/Components/Buttons";
import { FiSettings } from "react-icons/fi";
import { BsSendPlus } from "react-icons/bs";
import { openModal } from "@/Functions";
import NewMessageModal from "@/Pages/Modals/NewMessageModal";
import { router } from "@inertiajs/react";

export default function MessagesLeftTopNavbar({ user }) {
    const handleNewMessage = (e) => {
        e.preventDefault();
        openModal('new-message-modal', <NewMessageModal user={user} users={[...user.followings, ...user.followers]} />);
    }
    const handleSettings = (e) => {
        e.preventDefault();
        router.get('/settings/privacity/direct_messages');
    }
    return (
        <>
            <nav className='sticky flex items-center top-0 w-full backdrop-blur-md'>
                <div className='bg-white/25 flex gap-6 items-center w-full'>
                    <div className='flex items-start w-full justify-between px-3 py-3'>
                        <h2 className='text-lg font-bold'>Messages</h2>
                        <div className='inline-flex'>
                            <IconButton onClick={handleSettings} className='border-none text-lg hover:bg-[var(--light-grey)]'>
                                <FiSettings />
                            </IconButton>
                            <IconButton onClick={handleNewMessage} className='border-none text-lg hover:bg-[var(--light-grey)]'>
                                <BsSendPlus />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}