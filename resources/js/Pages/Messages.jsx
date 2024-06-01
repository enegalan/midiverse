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
import { formatDateForPublic } from "@/Functions";
import axios from "axios";
import { data } from "autoprefixer";

export default function Messages({ user = null, messages = [], selectedUser = null }) {
    var [directMessages, setDirectMessages] = useState(messages);
    const [messagesUsers, setMessagesUsers] = useState([]);
    const [selectedChat, setSelectedChat] = useState(selectedUser);
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
            uniqueUsers[message.sender.username] = {
                id: message.sender.id,
                avatar: message.sender.avatar || '',
                alt: message.sender.username,
                title: message.sender.username,
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

    const handleNewMessage = (e) => {
        e.preventDefault();
        // Implement the logic to handle new message
    };

    const handleSelectUserChat = (e) => {
        // <hack>
        var username = e.target.parentElement.parentElement.parentElement.parentElement.children[0].children[1].children[0].children[0].innerText;
        // </hack>
        window.location.href = `/messages/${username}`;
    };

    return (
        <MainLayout user={user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
            <section className="pb-16 border-r relative max-w-[430px] flex-1">
                {messagesUsers.length > 0 ? (
                    <div className="w-full h-full">
                        <MessagesLeftTopNavbar />
                        <div className="px-3 my-3">
                            <SearchInput placeholder='Search Direct Messages' />
                        </div>
                        <div className='overflow-scroll'>
                            {messagesUsers.map((user, index) => (
                                <ChatItem
                                    id={user.id}
                                    key={index}
                                    avatar={user.avatar}
                                    alt={user.title}
                                    onClick={handleSelectUserChat}
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
                        <MessagesLeftTopNavbar />
                        <div className='flex flex-col gap-3 py-8 justify-center items-center'>
                            <h1 className='font-bold text-3xl px-10'>Welcome to your inbox!</h1>
                            <h3 className='text-[var(--grey)] text-sm pl-10'>Drop a line, share posts and more with private conversations between you and others on miDiverse.</h3>
                        </div>
                        <AuthButton className='ml-10 bg-[var(--blue)] text-[var(--white)] hover:bg-[var(--hover-blue)]' text='Write a message' onClick={handleNewMessage} />
                    </div>
                )}
            </section>
            <RightNavbar className='py-0 px-0 gap-0' rightBorder={true} width="600px" minWidth='600px'>
                {selectedChat ? (
                    <>
                        <MessagesRightTopNavbar user={selectedChat} />
                        <div className="overflow-y-scroll" ref={messageListReference}>
                            <div className='flex flex-col'>
                                <div className='pb-8 overflow-y-scroll mt-20'>
                                    <MessageList
                                        className='message-list'
                                        lockable={true}
                                        toBottomHeight={'100%'}
                                        dataSource={directMessages.map((message) => {
                                            if (message.sender.id !== selectedChat.id) return null;
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
                        <MessageForm receiverUser={selectedChat} />
                    </>
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
