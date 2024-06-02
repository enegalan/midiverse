import MainLayout from "@/Layouts/mainLayout";
import RightNavbar from "@/Components/Navbars/RightNavbar";
import MessageForm from "./Forms/MessageForm";
import { useState, useEffect, useRef } from "react";
import React from "react";
import MessagesLeftTopNavbar from "@/Components/Navbars/Messages/MessagesLeftTopNavbar";
import MessagesRightTopNavbar from "@/Components/Navbars/Messages/MessagesRightTopNavbar";
import { MessageList, ChatItem } from 'react-chat-elements';
import { AuthButton } from "@/Components/Buttons";
import { SearchInput } from "@/Components/Inputs";
import { formatDateForPublic, isUserFollowing, isUserFollower, openModal } from "@/Functions";
import NewMessageModal from "./Modals/NewMessageModal";
import axios from "axios";
import { router } from "@inertiajs/react";
import { BackButton } from "@/Components/Buttons";
import { FollowButton } from "@/Components/Buttons";
import { InputSwitch } from 'primereact/inputswitch';

export default function Messages({ user = null, messages = [], selectedUser = null }) {
    var [directMessages, setDirectMessages] = useState(messages);
    const [messagesUsers, setMessagesUsers] = useState([]);
    const [selectedChat, setSelectedChat] = useState(selectedUser);
    const [infoVisible, setInfoVisible] = useState(false);
    const [snoozeUser, setSnoozeUser] = useState(false);
    const messageListReference = useRef(null);
    useEffect(() => {
        if (user) {
            const channel = window.Echo.private(`messages.${user.id}`)
                .listen('DirectMessageSent', (e) => {
                    setDirectMessages((directMessages) => [...directMessages, e.message]);
                });

            return () => {
                channel.stopListening('DirectMessageSent');
                window.Echo.leaveChannel(`messages.${user.id}`);
            };
        }
    }, [user]);
    useEffect(() => {
        const uniqueUsers = {};
        for (let message of messages) {
            let uniqueUser = message.receiver.username == user.username ? message.sender : message.receiver;
            uniqueUsers[uniqueUser.username] = {
                id: uniqueUser.id,
                avatar: uniqueUser.avatar || '',
                alt: uniqueUser.username,
                title: uniqueUser.username,
                subtitle: message.message,
                dateString: formatDateForPublic(message.created_at),
            };
        }
        setMessagesUsers(Object.values(uniqueUsers));
    }, [messages]);
    useEffect(() => {
        if (messageListReference.current) {
            messageListReference.current.scrollTop = messageListReference.current.scrollHeight;
        }
    }, [directMessages]);
    useEffect(() => {
        if (!selectedChat) return;
        for (let snoozedUser of user.snoozed_users) {
            if (snoozedUser.id == selectedChat.id) {
                setSnoozeUser(true);
            }
        }
    }, [selectedChat]);
    const handleNewMessage = (e) => {
        e.preventDefault();
        openModal('new-message-modal', <NewMessageModal user={user} users={[...user.followings, ...user.followers]} />);
    };
    const handleSelectUserChat = (user) => {
        router.get(`/messages/${user.title}`);
    };
    const handleInfoClick = () => {
        setInfoVisible(true);
    }
    const handleBack = (e) => {
        e.preventDefault();
        setInfoVisible(false);
    }
    const handleSnooze = (e) => {
        e.preventDefault();
        setSnoozeUser(!snoozeUser);
        const formData = new FormData();
        formData.append('snoozed_user_id', selectedChat.id);
        axios.post('/user/snooze/', formData);
    }
    return (
        <MainLayout user={user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
            <section className="pb-16 border-r relative max-w-[430px] flex-1">
                {messagesUsers.length > 0 ? (
                    <div className="w-full h-full absolute">
                        <MessagesLeftTopNavbar user={user} />
                        <div className="px-3 my-3">
                            <SearchInput placeholder='Search Direct Messages' />
                        </div>
                        <div className=''>
                            {messagesUsers.map((user, index) => (
                                <ChatItem
                                    id={user.id}
                                    key={index}
                                    avatar={user.avatar}
                                    alt={user.title}
                                    onClick={(e) => {handleSelectUserChat(user)}}
                                    title={user.title}
                                    subtitle={user.subtitle}
                                    date={user.dateString}
                                    className={`${selectedChat && selectedChat.id === user.id ? 'bg-[var(--hover-light)] border-r-2 border-[var(--blue)]' : ''}`}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full">
                        <MessagesLeftTopNavbar user={user} />
                        <div className='flex flex-col gap-3 py-8 justify-center items-center'>
                            <h1 className='font-bold text-3xl px-10'>Welcome to your inbox!</h1>
                            <h3 className='text-[var(--grey)] text-sm pl-10'>Drop a line, share posts and more with private conversations between you and others on miDiverse.</h3>
                        </div>
                        <AuthButton className='ml-10 bg-[var(--blue)] text-[var(--white)] hover:bg-[var(--hover-blue)]' text='Write a message' onClick={handleNewMessage} />
                    </div>
                )}
            </section>
            <RightNavbar setPaddingY={false} setPaddingX={false} className='py-0 px-0 gap-0' rightBorder={true} width="600px" minWidth='600px'>
                {selectedChat && !infoVisible ? (
                    <>
                        <MessagesRightTopNavbar onInfoClick={handleInfoClick} user={selectedChat} />
                        <div className="overflow-y-scroll h-full" ref={messageListReference}>
                            <div className='flex flex-col'>
                                <div className='pb-8 overflow-y-scroll mt-20'>
                                    <MessageList
                                        className='message-list'
                                        lockable={true}
                                        toBottomHeight={'100%'}
                                        dataSource={directMessages.map((message) => {
                                            let uniqueUser = message.receiver.username == user.username ? message.sender : message.receiver;
                                            if (uniqueUser.id !== selectedChat.id) return;
                                            let type = message.media != null ? 'photo' : 'text';
                                            let uri = message.media != null ? '/storage/' + message.media : 'nofound';
                                            return {
                                                position: message.sender.id === user.id ? 'right' : 'left',
                                                type: type,
                                                text: message.message || '',
                                                dateString: message.created_at,
                                                id: message.id,
                                                data: {
                                                    uri: uri,
                                                },
                                            };
                                        }).filter(Boolean)} // Filter out null values
                                    />
                                </div>
                            </div>
                        </div>
                        <MessageForm user={user} receiverUser={selectedChat} />
                    </>
                ) : infoVisible ? (
                    <div className='h-full'>
                        <div className='px-5 py-2 flex gap-8 mb-2 items-center'>
                            <BackButton onClick={handleBack} />
                            <h2 className='font-bold text-xl'>Conversation info</h2>
                        </div>
                        <div className='flex items-center justify-between py-3 px-5 cursor-pointer hover:bg-[var(--hover-light)]'>
                            <div className='flex items-center gap-2'>
                                <div>
                                    <img className='w-12 rounded-full' src={selectedChat.avatar} alt={selectedChat.username} />
                                </div>
                                <div className='flex flex-col'>
                                    <h3 className='text-md font-bold'>{selectedChat.name} {selectedChat.lastname ?? ''}</h3>
                                    <div className='flex items-center gap-1'>
                                        <h4 className='text-sm text-[var(--grey)]'>@{selectedChat.username}</h4>
                                        {isUserFollower(user, selectedChat) && isUserFollowing(user, selectedChat) ? (
                                            <span className='rounded text-xs text-[var(--grey)] py-[0.15rem] px-1 bg-[var(--hover-light)]'>You follow each other</span>
                                        ) : isUserFollowing(user, selectedChat) ? (
                                            <span className='rounded text-xs text-[var(--grey)] py-[0.15rem] px-1 bg-[var(--hover-light)]'>You are follower</span>
                                        ) : isUserFollower(user, selectedChat) && (
                                            <span className='rounded text-xs text-[var(--grey)] py-[0.15rem] px-1 bg-[var(--hover-light)]'>Follows you</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <FollowButton user={selectedChat} />
                            </div>
                        </div>
                        <div className='border-y'>
                            <div className='p-4'>
                                <h3 className='font-bold text-xl'>Notifications</h3>
                                <div className='mt-6 flex items-center justify-between'>
                                    <span className='text-sm'>Snooze notifications from {selectedChat.name} {selectedChat.lastname ?? ''}</span>
                                    <InputSwitch checked={snoozeUser} onClick={handleSnooze} />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='h-full mx-28 flex flex-col gap-2 justify-center text-start items-start'>
                        <h1 className='font-bold text-3xl'>Select a message</h1>
                        <h3 className='text-[var(--grey)] text-sm'>Choose from your existing conversations, start a new one, or just keep swimming.</h3>
                        <div className='mt-6'>
                            <AuthButton className='bg-[var(--blue)] text-[var(--white)] hover:bg-[var(--hover-blue)]' text='Write a message' onClick={handleNewMessage} />
                        </div>
                    </div>
                )}
            </RightNavbar>
        </MainLayout>
    );
}
