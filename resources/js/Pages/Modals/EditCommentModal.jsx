import React, { useState, useEffect } from 'react';
import { AuthButton, CloseButton } from '@/Components/Buttons';
import { FloatLabelInput, TextAreaInput } from '@/Components/Inputs';
import { Link } from '@inertiajs/react';
import { closeModal, formatDate, getAllMonths, getMonthDays, getYearsFromYearsAgo, openModal } from '@/Functions';
import ConfirmationDialog from './ConfirmationDialog';
import { Dropdown } from '@/Components/Inputs';
import axios from 'axios';
import { InputError } from '@/Components/Inputs';
import PostEditor from '@/Components/PostEditor';

export default function EditCommentModal({ comment }) {
    const [value, setValue] = useState(comment.body);

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('body', value);
        axios.post(`/comment/${comment.token}`, formData).then(() => {onClose(); window.location.reload();})
    };

    const onClose = () => {
        closeModal('edit-comment-modal');
    };

    return (
        <div id='edit-comment-modal' tabIndex="-1" aria-hidden="true" className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-screen inset-0 max-h-full">
            <div className='fixed w-full h-screen pointer bg-[#00000066]'></div>
            <div className="relative max-w-[650px] w-full max-h-full">
                <div className="relative bg-white rounded-lg shadow min-h-[600px] max-h-[600px] overflow-y-auto">
                    <nav className='sticky flex items-center rounded-lg top-0 z-50 w-full backdrop-blur-md border-b border-gray-200/50'>
                        <div className='bg-white/85 px-3 flex gap-6 items-center w-full justify-between'>
                            <div className='flex gap-8 items-center'>
                                <CloseButton onClick={onClose} />
                                <div className='flex flex-col'>
                                    <h2 className='font-bold text-xl'>Edit comment</h2>
                                </div>
                            </div>
                            <AuthButton onClick={handleSave} className='bg-[var(--dark)] text-white transition duration-300 hover:bg-[var(--hover-black)]' text='Update' />
                        </div>
                    </nav>
                    <main className='flex flex-col items-center justify-center'>
                        <section className='flex flex-col w-full gap-8 px-5 my-8'>
                            <PostEditor id='edit-comment-editor' onChange={(value) => setValue(value)} initialValue={value} removeButton={true} user={comment.user} />
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}
