import { useState, useRef } from 'react';
import { Editor, EditorProvider } from 'react-simple-wysiwyg';
import { convert } from 'html-to-text';
import { AuthButton, IconButton } from './Buttons';
import { IoEarth, IoEarthOutline } from 'react-icons/io5';
import { PiImageBold } from "react-icons/pi";
import { Link } from '@inertiajs/react';
import { FaCheck } from 'react-icons/fa6';
import { SiMidi } from "react-icons/si";
import { Carousel } from 'primereact/carousel';
import { CloseButton } from './Buttons';
import axios from 'axios';
import { useEffect } from 'react';
import EmojiPicker from "emoji-picker-react";
const convertOptions = {
    wordwrap: 130,
};
export default function PostEditor({
    id = 'default',
    initialValue = '',
    onChange = (value) => { },
    user = {},
    placeholder = 'Write here...',
    buttonText = 'Post',
    action = '/post/create',
    onSubmit = null,
    border = true,
    padding = true,
    removeButton = false,
    initialMedia = [],
}) {
    const [value, setValue] = useState(initialValue);
    const [focusActive, setFocusActive] = useState(false);
    const [whoCanReplyVisible, setWhoCanReplyVisible] = useState(false);
    const [visibility, setVisibility] = useState(0);
    const [media, setMedia] = useState(initialMedia);
    const [preview, setPreview] = useState(initialMedia);
    const [showPicker, setShowPicker] = useState(false);
    const fileInputRef = useRef(null);
    const maxWordLimit = 280;
    const minStrokeDashOffset = 62.60745359653945;
    const maxStrokeDashOffset = 120.24777960769379;
    const [strokeDashOffset, setStrokeDashOffset] = useState(minStrokeDashOffset);
    const strokePerWordValue = 0.2243994753;
    useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdownElements = document.querySelectorAll(".dropdown");
            let outsideClick = true;
            for (let dropdown of dropdownElements) {
                if (dropdown.contains(event.target)) {
                    outsideClick = false;
                }
            }
            if (outsideClick) {
                setShowPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPicker]);
    const onEditorChange = (e) => {
        const inputValue = e.target.value;
        const convertedValue = convert(e.target.value, convertOptions);
        onChange(convertedValue, visibility, media);
        const wordCount = inputValue.length;
        if (wordCount <= maxWordLimit) {
            setValue(inputValue);
            let newStrokeDashOffset = minStrokeDashOffset;
            for (let i = 2; i < wordCount; i++) {
                newStrokeDashOffset -= strokePerWordValue;
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
        if (value.length > 0 || media.length > 0) {
            const formData = new FormData();
            var convertedData = '';
            if (value) {
                convertedData = convert(value, convertOptions);
                formData.append('content', convertedData);
            }
            formData.append('visibility', visibility);
            media.forEach((mediaItem, index) => {
                formData.append('media[]', mediaItem.file);
            });
            onSubmit ? onSubmit(convertedData, visibility, media) : axios.post(action, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => {
                window.location.reload();
            }).catch(error => console.error(error));
        }
    }
    const handleOnFocus = () => {
        setFocusActive(true);
    }
    const handleWhoCanReply = () => {
        setWhoCanReplyVisible(!whoCanReplyVisible);
    }
    const handleEveryone = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setVisibility(0);
        setWhoCanReplyVisible(false);
    }
    const handleFollowers = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setVisibility(1);
        setWhoCanReplyVisible(false);
    }
    const handleOnlyYou = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setVisibility(2);
        setWhoCanReplyVisible(false);
    }
    const handleImageClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileInputRef.current.click();
    }
    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files) {
            let newMedia = files.map((file, index) => ({ id: media.length + index + 1, file }));
            setMedia(prevMedia => [...prevMedia, ...newMedia]);
            let previews = files.map((file, index) => ({
                id: preview.length + index + 1,
                url: URL.createObjectURL(file),
            }));
            setPreview(prevPreview => [...prevPreview, ...previews]);
        }
    }
    useEffect(() => {
        // Calculate when to do next slide
        if (preview.length > 2) {
            document.querySelector('.p-carousel-next')?.click();
            document.querySelector('.p-carousel-next')?.click();
        }
    }, [preview])
    useEffect(() => {
        if (value) {
            let convertedData = convert(value, convertOptions);
            onChange(convertedData, visibility, media);
        }
    }, [preview, media])
    const imageTemplate = (mediaPreview) => {
        const handleClose = () => {
            const updatedPreview = preview.filter(file => file.id !== mediaPreview.id);
            setPreview(updatedPreview);
            const updatedMedia = media.filter(item => item.id !== mediaPreview.id);
            setMedia(updatedMedia);
            const updatedFiles = Array.from(fileInputRef.current.files).filter((_, idx) => idx !== mediaPreview.id - 1);
            const newFileList = new DataTransfer();
            updatedFiles.forEach(file => newFileList.items.add(file));
            fileInputRef.current.files = newFileList.files;
        }
        return (
            <div className='rounded-xl relative cursor-pointer bg-center bg-no-repeat bg-cover bg-transparent h-full' style={{ backgroundImage: `url(${mediaPreview.url})` }}>
                <div className='absolute right-4 top-1'>
                    <CloseButton onClick={handleClose} className='bg-[var(--dark-gray)] text-[var(--white)] hover:bg-[var(--hover-dark-gray)]' />
                </div>
                <img style={{ visibility: 'hidden' }} src={mediaPreview.url} />
            </div>
        )
    }
    const onEmojiClick = (emojiObject, event) => {
        const emoji = emojiObject.emoji;
        setValue((prevValue) => prevValue + emoji);
        setShowPicker(false);
    };
    return (
        <div className={`${padding ? 'p-4' : ''} ${border ? 'border-b' : ''} flex gap-2`}>
            <div>
                <img className='w-12 rounded-full' src={user.avatar} alt={`${user.username} avatar`} />
            </div>
            <div className='flex flex-col w-full'>
                <div className='' id='editor'>
                    <EditorProvider>
                        <div className='mb-2 inline-grid w-full relative'>
                            <Editor
                                value={value}
                                onChange={onEditorChange}
                                onFocus={handleOnFocus}
                                containerProps={{ style: { fontSize: '20px', border: 'none' } }}
                                id={`${id}-post-editor`}
                                placeholder={placeholder}
                            />
                        </div>
                        {preview.length > 0 && (
                            preview.length > 1 ? (
                                <div className='flex'>
                                    <Carousel showIndicators={false} className='w-full' numVisible={2} numScroll={1} value={preview} itemTemplate={imageTemplate} />
                                </div>
                            ) : (
                                <div className='rounded-xl relative cursor-pointer bg-center bg-no-repeat bg-cover bg-transparent' style={{ backgroundImage: `url(${preview[0].url})` }}>
                                    <div className='absolute right-4 top-1'>
                                        <CloseButton onClick={() => { setPreview([]); setMedia([]); fileInputRef.current.value = ''; }} className='bg-[var(--dark-gray)] text-[var(--white)] hover:bg-[var(--hover-dark-gray)]' />
                                    </div>
                                    <img style={{ visibility: 'hidden' }} src={preview[0].url} />
                                </div>
                            )
                        )}
                        {focusActive && (
                            <div className='relative'>
                                <div onClick={handleWhoCanReply} className='inline-flex select-none items-center ml-2 py-[0.12rem] px-3 gap-2 rounded-full text-[var(--blue)] transition duration-300 cursor-pointer hover:bg-[var(--hover-blue)]'>
                                    {visibility == 0 ? (
                                        <>
                                            <span className='pointer-events-none'><IoEarth /></span>
                                            <span className='pointer-events-none font-bold text-sm'>Everyone can reply</span>
                                        </>
                                    ) : visibility == 1 ? (
                                        <>
                                            <span className='pointer-events-none'><i className={`pi pi-users`} /></span>
                                            <span className='pointer-events-none font-bold text-sm'>Accounts you follow can reply</span>
                                        </>
                                    ) : visibility == 2 && (
                                        <>
                                            <span className='pointer-events-none'><i className={`pi pi-user`} /></span>
                                            <span className='pointer-events-none font-bold text-sm'>Only you can reply</span>
                                        </>
                                    )}
                                </div>
                                {whoCanReplyVisible && (
                                    <section className='dropdown absolute -top-28 left-52'>
                                        <div className='absolute top-36 -left-64 min-w-[300px] bg-white rounded-lg dropdown-shadow'>
                                            <div className='flex flex-col'>
                                                <div className='px-4 py-3'>
                                                    <h1 className='font-bold text-md'>Who can reply?</h1>
                                                    <h3 className='text-sm text-[var(--grey)]'>Choose who can reply to this post. Anyone mentioned can always reply.</h3>
                                                </div>
                                                <Link onClick={handleEveryone} className='flex items-center justify-between font-semibold px-4 py-3 hover:bg-[var(--hover-light)]'>
                                                    <div className='flex items-center gap-3'>
                                                        <span className='pointer-events-none bg-[var(--blue)] text-[var(--white)] rounded-full px-3 py-3'><IoEarthOutline /></span>
                                                        <span className='pointer-events-none'>Everyone</span>
                                                    </div>
                                                    {visibility == 0 && (
                                                        <div className='text-[var(--blue)]'>
                                                            <FaCheck />
                                                        </div>
                                                    )}
                                                </Link>
                                                <Link onClick={handleFollowers} className='flex items-center justify-between font-semibold px-4 py-3 hover:bg-[var(--hover-light)]'>
                                                    <div className='flex items-center gap-3'>
                                                        <span className='pointer-events-none bg-[var(--blue)] text-[var(--white)] rounded-full px-3 py-2'><i className={`pi pi-users`} /></span>
                                                        <span className='pointer-events-none'>Accounts you follow</span>
                                                    </div>
                                                    {visibility == 1 && (
                                                        <div className='text-[var(--blue)]'>
                                                            <FaCheck />
                                                        </div>
                                                    )}
                                                </Link>
                                                <Link onClick={handleOnlyYou} className='flex items-center rounded-b-lg justify-between font-semibold px-4 py-3 hover:bg-[var(--hover-light)]'>
                                                    <div className='flex items-center gap-3'>
                                                        <span className='pointer-events-none bg-[var(--blue)] text-[var(--white)] rounded-full px-3 py-2'><i className={`pi pi-user`} /></span>
                                                        <span className='pointer-events-none'>Only you</span>
                                                    </div>
                                                    {visibility == 2 && (
                                                        <div className='text-[var(--blue)]'>
                                                            <FaCheck />
                                                        </div>
                                                    )}
                                                </Link>
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </div>
                        )}
                        <nav className={`flex ${border && 'border-t'} items-center justify-between pt-5 mt-2`} id='toolbar'>
                            <div className='flex items-center gap-1'>
                                <IconButton onClick={handleImageClick} className={`${media.length === 4 ? 'text-[var(--hover-lightblue)] cursor-auto' : 'text-[var(--blue)] hover:bg-[var(--hover-lightblue)]'} border-none text-[1.08rem] p-3 `}>
                                    <PiImageBold />
                                </IconButton>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className='hidden'
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    multiple
                                />
                                <IconButton className='text-lg border-none p-3 text-[var(--blue)] hover:bg-[var(--hover-lightblue)]'>
                                    <SiMidi />
                                </IconButton>
                                <div className='relative'>
                                    <IconButton onClick={(e) => { e.preventDefault(); setShowPicker(!showPicker) }} className='text-sm border-none p-[0.68rem] px-[0.85rem] text-[var(--blue)] hover:bg-[var(--hover-lightblue)]'>
                                        <i style={{ WebkitTextStrokeWidth: 'thin' }} className="fa-regular fa-face-smile"></i>
                                    </IconButton>
                                    {showPicker && (
                                        <div className='dropdown absolute z-50 mt-3'>
                                            <EmojiPicker skinTonePickerLocation='PREVIEW' searchPlaceHolder='Search emojis' lazyLoadEmojis={true} theme='auto' open={showPicker} emojiStyle='native' pickerStyle={{ width: "100%" }} onEmojiClick={onEmojiClick} />
                                        </div>
                                    )}
                                </div>
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
                                    <AuthButton onClick={handlePost} disabled={(value.length === 0 && media.length === 0)} className={`${value.length > 0 || media.length > 0 ? 'bg-[var(--blue)] hover:bg-[var(--hover-blue)]' : 'bg-[var(--light-blue)] hover:bg-[var(--light-blue)] hover:cursor-default'} text-white `} text={buttonText} />
                                )}
                            </div>
                        </nav>
                    </EditorProvider>
                </div>
            </div>
        </div>
    );
}
