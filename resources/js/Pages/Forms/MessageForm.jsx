import React, { useState } from 'react';
import axios from 'axios';
import { ChatInput } from '@/Components/Inputs';

const MessageForm = ({ receiverUser }) => {
    return (
        <form className='w-full sticky bottom-0 flex justify-between items-center gap-2'>
            <ChatInput receiverUser={receiverUser} />
        </form>
    );
};

export default MessageForm;
