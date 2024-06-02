import React, { useState } from 'react';
import axios from 'axios';
import { ChatInput } from '@/Components/Inputs';

const MessageForm = ({ user, receiverUser }) => {
    return (
        <form className='w-full sticky bottom-0 flex justify-between items-center gap-2'>
            <ChatInput user={user} receiverUser={receiverUser} />
        </form>
    );
};

export default MessageForm;
