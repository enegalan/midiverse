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

export default function EditPostModal({ post }) {
    const [value, setValue] = useState(post.content);
    const [visibility, setVisibility] = useState(post.comments_visibility);
    const [media, setMedia] = useState(post.media.map((file) => ({
        id: file.id,
        url: '/storage/media/' + file.filename,
        file: null,
    })));
    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('post_id', post.id);
        formData.append('visibility', visibility);
        var prevMedia = [];
        media.forEach((file, index) => {
            if (file.file != null && file.file instanceof File) {
                formData.append(`media[${index}]`, file.file);
            } else {
                prevMedia.push(file.id);
            }
        });
        formData.append('prev_media', JSON.stringify(prevMedia))
        if (!value) setValue('');
        formData.append('content', value);
        axios.post('/post/edit/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(() => {onClose(); window.location.reload();})
    };
    const onClose = () => {
        closeModal('edit-post-modal');
    };
    useEffect(() => {
        const onEscapePressed = (e) => {
            if (e.key == 'Escape') {
                onClose();
            }
        }
        document.addEventListener('keydown', onEscapePressed);
        return () => {
            document.removeEventListener('keydown', onEscapePressed);
        };
    });
    useEffect(() => {
        const handleClickOutside = (event) => {
            let outsideClick = true;
            if (event.target.id != 'modal-bg') {
                outsideClick = false;
            }
            if (outsideClick) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });
    return (
        <div id='edit-post-modal' tabIndex="-1" aria-hidden="true" className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-screen inset-0 max-h-full">
            <div id='modal-bg' className='fixed w-full h-screen pointer bg-[#00000066]'></div>
            <div className="relative max-w-[650px] w-full max-h-full">
                <div className="relative bg-white rounded-lg shadow min-h-[600px] max-h-[600px] overflow-y-auto">
                    <nav className='sticky flex items-center rounded-lg top-0 z-50 w-full backdrop-blur-md border-b border-gray-200/50'>
                        <div className='bg-white/25 px-3 flex gap-6 items-center w-full justify-between'>
                            <div className='flex gap-8 items-center'>
                                <CloseButton onClick={onClose} />
                                <div className='flex flex-col'>
                                    <h2 className='font-bold text-xl'>Edit post</h2>
                                </div>
                            </div>
                            <AuthButton onClick={handleSave} className='bg-[var(--dark)] text-white transition duration-300 hover:bg-[var(--hover-black)]' text='Update' />
                        </div>
                    </nav>
                    <main className='flex flex-col items-center justify-center'>
                        <section className='flex flex-col w-full gap-8 px-5 my-8' id='post-info'>
                            <PostEditor initialMedia={media} id='edit-post-editor' onChange={(value, visibility, media) => { setVisibility(visibility); setValue(value); setMedia(media) }} initialValue={value} removeButton={true} user={post.user} />
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}
