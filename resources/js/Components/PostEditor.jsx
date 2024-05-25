import { useState, useEffect } from 'react';
import {
    Editor,
    EditorProvider,
} from 'react-simple-wysiwyg';

import { AuthButton, IconButton } from './Buttons';

import { PiImageBold } from "react-icons/pi";
import { HiOutlineGif } from "react-icons/hi2";

import axios from 'axios';

export default function PostEditor({ id = 'default', initialValue = '', onChange = (value) => {}, user = {}, placeholder = 'Write here...', buttonText = 'Post', action = '/post/create', onSubmit = null, border = true, padding = true, removeButton = false }) {
    const [value, setValue] = useState(initialValue);
    const maxWordLimit = 280;
    const minStrokeDashOffset = 62.60745359653945;
    const maxStrokeDashOffset = 120.24777960769379;
    const [strokeDashOffset, setStrokeDashOffset] = useState(minStrokeDashOffset);
    const strokePerWordValue = 0.2243994753;

    const onEditorChange = (e) => {
        const inputValue = e.target.value;
        onChange(e.target.value);
        const wordCount = inputValue.length;
        // Determine if is adding or removing
        let isAdding = true;
        if (wordCount < value.length) isAdding = false;
        if (wordCount <= maxWordLimit) {
            setValue(inputValue);
            var newStrokeDashOffset;
            if (isAdding) {
                newStrokeDashOffset = minStrokeDashOffset;
            } else {
                newStrokeDashOffset = minStrokeDashOffset;
            }
            for (let i = 2; i < wordCount; i++) {
                if (isAdding) {
                    newStrokeDashOffset -= strokePerWordValue;
                } else {
                    newStrokeDashOffset -= strokePerWordValue;
                }
            }
            if (wordCount > 0) {
                setStrokeDashOffset(newStrokeDashOffset);
            } else {
                setValue('');
                setStrokeDashOffset(minStrokeDashOffset);
            }
        }
    };
    const handlePost = (e) => {
        e.preventDefault();
        if (value.length > 0) {
            const formData = new FormData();
            formData.append('content', value);
            onSubmit ? onSubmit(value) : axios.post(action, formData).then(res => {
                window.location.reload();
            }).catch(error => console.error(error))
            
        }
    }
    return (
        <div className={`${padding ? 'p-4' : ''} ${border ? 'border-b' : ''} flex gap-2`}>
            <div>
                <img className='w-12 rounded-full' src={user.avatar} alt={`${user.username} avatar`} />
            </div>
            <div className='flex flex-col w-full'>
                <div className='' id='editor'>
                    <EditorProvider>
                        <div className='mb-2 inline-grid w-full'>
                            <Editor
                                value={value}
                                onChange={onEditorChange}
                                containerProps={{ style: { fontSize: '20px', border: 'none' } }}
                                id={`${id}-post-editor`}
                                placeholder={placeholder}
                            />
                        </div>
                        <nav className={`flex ${border && 'border-t'} items-center justify-between pt-5 mt-2`} id='toolbar'>
                            <div className='flex items-center gap-1'>
                                <IconButton className='border-none text-[1.08rem] p-3 text-[var(--blue)] hover:bg-[var(--hover-lightblue)]'>
                                    <PiImageBold />
                                </IconButton>
                                <IconButton className='icon-stroke-bolder text-lg border-none p-3 text-[var(--blue)] hover:bg-[var(--hover-lightblue)]'>
                                    <HiOutlineGif />
                                </IconButton>
                                <IconButton className='text-sm border-none p-[0.68rem] px-[0.85rem] text-[var(--blue)] hover:bg-[var(--hover-lightblue)]'>
                                    <i style={{ WebkitTextStrokeWidth: 'thin' }} className="fa-regular fa-face-smile"></i>
                                </IconButton>
                            </div>
                            <div className='flex items-center gap-3'>
                                {value.length > 0 && (
                                    <div className='rounded w-[25px] h-[25px] -rotate-90'>
                                        <svg height="100%" viewBox="0 0 20 20" width="100%" style={{ overflow: 'visible' }}>
                                            <defs>
                                                <clipPath id="0.1498365390679075">
                                                    <rect height="100%" width="0" x="0">
                                                    </rect>
                                                </clipPath>
                                            </defs>
                                            <circle cx="50%" cy="50%" fill="none" r="10" stroke="#2F3336" strokeWidth="2"></circle>
                                            <circle cx="50%" cy="50%" fill="none" r="10" stroke="#1D9BF0" strokeDasharray="62.83185307179586" strokeDashoffset={strokeDashOffset} strokeLinecap="round" strokeWidth="2"></circle>
                                            <circle cx="50%" cy="50%" clipPath="url(#0.1498365390679075)" fill="#1D9BF0" r="0"></circle>
                                        </svg>
                                    </div>
                                )}
                                {!removeButton && (
                                    <AuthButton onClick={handlePost} disabled={value.length === 0} className={`${value.length > 0 ? 'bg-[var(--blue)] hover:bg-[var(--hover-blue)]' : 'bg-[var(--light-blue)] hover:bg-[var(--light-blue)] hover:cursor-default'} text-white `} text={buttonText} />
                                )}
                            </div>
                        </nav>
                    </EditorProvider>
                </div>
            </div>
        </div>
    );
}