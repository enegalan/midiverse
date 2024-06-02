import BaseModal from './BaseModal';
import { GoogleLoginButton, AuthButton } from '@/Components/Buttons';
import { FloatLabelInput } from '@/Components/Inputs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Separator from '@/Components/Separator';
import { Link } from '@inertiajs/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { closeModal, openModal, validateEmail } from '@/Functions';
import RegisterModal from './RegisterModal';
import { router } from '@inertiajs/react';
import { CloseButton } from '@/Components/Buttons';
import { TopSearchInput } from '@/Components/Inputs';
import { FaUser } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";

export default function NewMessageModal({ user, users = [] }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const handleSelectChat = (user) => {
        setSelectedUser(user);
    }
    const handleNext = (e) => {
        router.get(`/messages/${selectedUser.username}`)
        e.preventDefault();
        onClose();
    }
    const onClose = () => {
        closeModal('new-message-modal');
    };
    return (
        <div id='new-message-modal' tabIndex="-1" aria-hidden="true" className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-screen inset-0 max-h-full">
            <div className='fixed w-full h-screen pointer bg-[#00000066]'></div>
            <div className="relative max-w-[650px] w-full max-h-full">
                <div className="relative bg-white rounded-lg shadow min-h-[600px] max-h-[600px] overflow-y-auto">
                    <nav className='sticky flex items-center rounded-lg top-0 z-50 w-full backdrop-blur-md'>
                        <div className='bg-white/25 px-3 flex gap-6 items-center w-full justify-between'>
                            <div className='flex gap-8 items-center'>
                                <CloseButton onClick={onClose} />
                                <div className='flex flex-col'>
                                    <h2 className='font-bold text-xl'>New message</h2>
                                </div>
                            </div>
                            <AuthButton onClick={handleNext} className={`${selectedUser != null ? 'bg-[var(--dark)] hover:bg-[var(--hover-black)]' : 'bg-[var(--grey)] cursor-default hover:bg-[var(--grey)]'}  text-white transition duration-300 `} text='Next' />
                        </div>
                    </nav>
                    <div className='border-b'>
                        <TopSearchInput placeholder='Search people' />
                        {selectedUser != null && (
                            <div onClick={(e) => {e.preventDefault(); setSelectedUser(null)}} className='ml-3 my-2 rounded-full border inline-flex gap-2 items-center cursor-pointer p-1 transition duration-300 hover:bg-[var(--hover-lightblue)]'>
                                <img className='w-6 rounded-full' src={selectedUser.avatar} alt={selectedUser.username} />
                                <span>{selectedUser.name} {selectedUser.lastname ?? ''}</span>
                                <span className='ml-1 text-xl text-[var(--blue)] pr-3'><IoMdClose /></span>
                            </div>
                        )}
                    </div>
                    <main className='flex flex-col items-center justify-center'>
                        <div className='w-full'>
                            {users.map((user2) => {
                                return (
                                    <div key={user2.id} onClick={(e) => {e.preventDefault(); handleSelectChat(user2)}} className='w-full p-4 flex gap-2 justify-between items-center cursor-pointer transition duration-300 hover:bg-[var(--hover-light)]'>
                                        <div className='flex items-center gap-2'>
                                            <div>
                                                <img className='w-10 rounded-full' src={user2.avatar} alt={user2.username} />
                                            </div>
                                            <div className='flex flex-col'>
                                                <h3 className='text-md font-bold'>{user2.name} {user2.lastname ?? ''}</h3>
                                                <h4 className='text-sm text-[var(--grey)]'>@{user2.username}</h4>
                                                {user.followers.includes(user2) || user.followings.includes(user2) ? (
                                                    <h5 className='text-[var(--grey)] flex items-center gap-1'>
                                                        <span className='text-xs'><FaUser /></span>
                                                        <span className='text-sm'>{user.followers.includes(user2) && user.followings.includes(user2) ? 'You follow each other' : user.followings.includes(user2) ? 'You follow this user' : user.followers.includes(user2) ? 'This user follows you' : ''}</span>
                                                    </h5>
                                                ) : (
                                                    <h5 className='text-[var(--grey)] flex items-center gap-1'>
                                                        <span className={`text-sm ${user.allowed_message_requests ? 'text-[var(--grey)]' : ''}`}>{'@' + user.username}{user2.allowed_message_requests ? ` can't be messaged` : ''}</span>
                                                    </h5>
                                                )}
                                            </div>
                                        </div>
                                        {selectedUser && user2.username == selectedUser.username && (
                                            <div className='text-md text-[var(--blue)]'>
                                                <FaCheck />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}