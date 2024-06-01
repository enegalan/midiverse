import React, { useEffect, useState, useRef } from "react";
import { router } from '@inertiajs/react'
import { useForm } from "@inertiajs/inertia-react";
import PropTypes from "prop-types";
import '../../css/Inputs.css';
import { InputText } from "primereact/inputtext";
import { Password } from 'primereact/password';
import { InputTextarea } from "primereact/inputtextarea";
import { func } from "prop-types";
import { IconButton } from "./Buttons";
import { PiImageBold } from "react-icons/pi";
import { SiMidi } from "react-icons/si";
import { LuSendHorizonal } from "react-icons/lu";
import EmojiPicker from "emoji-picker-react";
import { CloseButton } from "./Buttons";

const SearchInput = ({ placeholder = '', action = null }) => {
    const { data, setData, post, processing, errors } = useForm({
        query: '',
    });

    const handleSearchChange = (event) => {
        const newQueryValue = event.target.value;
        event.stopPropagation();
        setData('query', newQueryValue);
        if (action) {
            setData('query', newQueryValue);
            if (action !== null) router.get(action, { 'query': newQueryValue }, { preserveState: true })
        }
    };

    return (
        <div className="relative flex items-center mt-4 md:mt-0">
            <span className="absolute">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </span>

            <input
                type="text"
                placeholder={placeholder}
                onChange={handleSearchChange}
                value={data.query}
                className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5" />
            {errors.query && (
                <div className="text-red-500">{errors.query}</div>
            )}
        </div>
    );
};
SearchInput.propTypes = {
    placeholder: PropTypes.string,
};

const DragAndDropBox = ({ id = '', title = 'Drag and drop your files here', subtitle = '(or click to select)', multiple = false, onChange = () => { }, previewImage = '' }) => {
    const [preview, setPreview] = useState('');
    useEffect(() => {
        const dropzone = document.getElementById(id + '-dropzone');
        const fileInput = document.getElementById(id + '-fileInput');
        const fileList = document.getElementById(id + '-fileList');

        /* When the user is dragging a file over the box */
        const dragOver = (e) => {
            e.preventDefault();
            dropzone.classList.remove('border-gray-300', 'border-2');
            dropzone.classList.add('border-blue-500', 'border-2');
        }
        /* When the user leaves dragging a file over the box */
        const dragLeave = () => {
            dropzone.classList.remove('border-blue-500', 'border-2');
            dropzone.classList.add('border-gray-300', 'border-2');
        }

        const drop = (e) => {
            e.preventDefault();
            dropzone.classList.remove('border-blue-500', 'border-2');
            dropzone.classList.add('border-gray-300', 'border-2');
            const files = e.dataTransfer.files;
            if (!multiple) handleFile(files[0]); return;
            handleFiles(files);
        }
        /* When the user try uploading file(s) */
        const change = (e) => {
            const files = e.target.files;
            if (!multiple) handleFile(files[0]); return;
            handleFiles(files);
        }

        dropzone.addEventListener('dragover', dragOver);
        dropzone.addEventListener('dragleave', dragLeave);
        dropzone.addEventListener('drop', drop);
        fileInput.addEventListener('change', change);

        function handleFiles(files) {
            fileList.innerHTML = '';
            for (const file of files) {
                const listItem = document.createElement('div');
                listItem.textContent = `${file.name} (${formatBytes(file.size)})`;
                fileList.appendChild(listItem);
            }
            setPreview(files[0]);
            onChange(files);
        }
        function handleFile(file) {
            fileList.innerHTML = '';
            const listItem = document.createElement('div');
            listItem.textContent = `${file.name} (${formatBytes(file.size)})`;
            fileList.appendChild(listItem);
            setPreview(file);
            onChange(file);
            // var formData = new FormData();
            // formData.append("file", file);
            // router.post('/preview', formData);
        }

        function formatBytes(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    }, [id, onChange, multiple]);

    return (
        <div className="w-full max-w-[1000px]">
            <div className="bg-gray-100 p-8 text-center rounded-lg border-dashed border-2 border-gray-300 hover:border-blue-500 transition duration-300 ease-in-out" id={`${id}-dropzone`}>
                <label htmlFor={`${id}-fileInput`} className="cursor-pointer flex flex-col items-center space-y-2">
                    <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    <span className="text-gray-600">{title}</span>
                    <span className="text-gray-500 text-sm">{subtitle}</span>
                </label>
                <input type="file" id={`${id}-fileInput`} accept=".png,.jpg,.jpeg,.svg,.aviff" className="hidden" multiple={multiple} />
            </div>
            {preview && preview !== '' || previewImage && previewImage !== '' ? (
                <div className='flex justify-center '>
                    {/* Display preview here */}
                    <img src={previewImage === '' ? URL.createObjectURL(preview) : previewImage} alt="Preview" className="p-2 w-32 rounded-full border h-auto mt-4" />
                </div>
            ) : (<></>)}
            <div className="mt-4 text-center" id={`${id}-fileList`}></div>
        </div>
    );
}

const TextInput = ({ name = '', labelClassName = '', placeholder = '', width = 'full', type = 'text', icon = '', image = '', value = '', minLength = '', maxLength = '', id = '', className = '' }) => {
    const [inputValue, setInputValue] = useState(value);
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    }
    const hasContentClass = inputValue ? 'has-content' : '';
    return (
        <div className='relative mt-2 z-20'>
            <input id={id} maxLength={maxLength} minLength={minLength} name={name} className={`textInput ${className} ${width} ${hasContentClass}`} onChange={handleInputChange} type={type} placeholder={icon || image ? '' : placeholder} value={inputValue} />
            {icon && <div className='flex w-[35px] h-full items-center absolute top-0'><i className={`${icon}`}></i></div>}
            {image && <img className='w-[20px] h-[20px]' src={`${image}`} alt='icon' />}
            {(icon || image) && <label className={labelClassName}>{placeholder}</label>}
            <span className='textInput-focus-bg'></span>
        </div>
    );
}
TextInput.propTypes = {
    name: PropTypes.string,
    placeholder: PropTypes.string,
    width: PropTypes.string,
    type: PropTypes.string,
    icon: PropTypes.string,
    image: PropTypes.string,
    value: PropTypes.string,
    minLength: PropTypes.string,
    maxLength: PropTypes.string,
};

const TextAreaInput = ({ placeholder = '', rows = 5, cols = 20, id = '', className = '', maxHeight = '200px', minHeight = '100px', minLength = '', maxLength = '', onChange = () => { }, value = '' }) => {
    return (
        <span className="p-float-label">
            <InputTextarea value={value} minLength={minLength} maxLength={maxLength} id={id} cols={cols} rows={rows} className={`${className} border max-h-[${maxHeight}] min-h-[${minHeight}]`} onChange={onChange} />
            <label htmlFor={id}>{placeholder}</label>
        </span>
    );
}
TextAreaInput.propTypes = {
    placeholder: PropTypes.string,
    rows: PropTypes.string || PropTypes.number,
    cols: PropTypes.string || PropTypes.number,
};

const DropdownCheckbox = ({ options = [{}], selectedOptionIds = [], onChange = (options) => { } }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState(selectedOptionIds);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const handleCheckboxChange = (option) => {
        setSelectedOptions((prevSelectedOptions) => {
            if (prevSelectedOptions.includes(option.id)) {
                return prevSelectedOptions.filter((id) => id !== option.id);
            } else {
                return [...prevSelectedOptions, option.id];
            }
        });
    };
    useEffect(() => {
        onChange(selectedOptions)
    }, [selectedOptions]);
    return (
        <div className="relative inline-block text-left flex-1">
            <div>
                <button
                    type="button"
                    onClick={toggleDropdown}
                    className="block w-full py-1.5 px-5 text-gray-700 bg-white border border-gray-200 rounded-lg placeholder-gray-400/70"
                    id="options-menu"
                    aria-haspopup="true"
                    aria-expanded="true"
                >
                    Selected: {selectedOptions && selectedOptions.length}
                </button>
            </div>
            {isOpen && (
                <div className="origin-top-right mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {selectedOptions && Array.isArray(options) && options?.length > 0 && options.map((option) => (
                            <label key={option.id} className="flex items-center py-2 px-4">
                                <input
                                    type="checkbox"
                                    value={option.id}
                                    onChange={() => handleCheckboxChange(option)}
                                    checked={selectedOptions.includes(option.id)}
                                    className="rounded form-checkbox h-5 w-5 text-[var(--main-blue)]"
                                />
                                <span className="ml-2 text-gray-700 text-sm">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
// Copy of DragAndDropBox due to create group not works reuse just one component
const DragAndDropBox2 = ({ id = '', title = 'Drag and drop your files here', subtitle = '(or click to select)', multiple = false, onChange = () => { }, previewImage = '' }) => {
    return <DragAndDropBox id={id} title={title} subtitle={subtitle} multiple={multiple} onChange={onChange} previewImage={previewImage} />
}

const Dropdown = ({ options = [{}], id = '', onChange = () => { }, placeholder = null, value = '' }) => {
    return (
        <select value={value} onChange={onChange} id={id} className="min-w-[80px] text-[var(--grey)] border rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full py-3 p-2.5">
            {placeholder !== null && (
                <option key={`${id}-placeholder`}>{placeholder}</option>
            )}
            {options.map((option, index) => {
                const { label, value } = option;
                return (
                    <option key={index} value={value}>{label}</option>
                );
            })}
        </select>
    );
}

const FloatLabelInput = ({ text, value, id, className = '', type = 'text', disabled = false, autoFocus = false, keyfilter = '', onChange = () => { }, name = '', invalid = false, autoComplete = '' }) => {
    if (type === 'password') {
        return (
            <span className="p-float-label w-full">
                <Password autoComplete={autoComplete} invalid={invalid} name={name} keyfilter={keyfilter} toggleMask feedback={false} className='w-full' autoFocus={autoFocus} inputId={id} disabled={disabled} value={value} onChange={onChange} inputClassName={`${className} rounded-md`} />
                <label htmlFor={id}>{text}</label>
            </span>
        );
    } else {
        return (
            <span className="p-float-label">
                <InputText invalid={invalid} name={name} type={type} keyfilter={keyfilter} autoFocus={autoFocus} disabled={disabled} id={id} value={value} onChange={onChange} className={`${className} rounded-md`} />
                <label htmlFor={id}>{text}</label>
            </span>
        );
    }
}

const InputError = ({ message, className = '', ...props }) => {
    return message ? (
        <p {...props} className={'text-sm text-red-600 ' + className}>
            {message}
        </p>
    ) : null;
}

const ChatInput = ({ receiverUser }) => {
    const [value, setValue] = useState('');
    const [media, setMedia] = useState([]);
    const [preview, setPreview] = useState([]);
    const [showPicker, setShowPicker] = useState(false);
    const fileInputRef = useRef(null);
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
    const handleSubmitMessage = (e) => {
        e.preventDefault();
        if (value.length > 0 || media.length > 0) {
            const formData = new FormData();
            formData.append('receiver_id', receiverUser.id);
            if (value) {
                formData.append('message', value);
            }
            if (media) {
                media.forEach((mediaItem, index) => {
                    formData.append('media[]', mediaItem.file);
                });
            }
            axios.post('/messages', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => {
                window.location.reload();
            }).catch(error => console.error(error));
        }
    }
    return (
        <aside className='border-t bg-[var(--white)] w-full'>
            <div className='flex items-center mx-[12px] my-[5px] gap-6 p-1 rounded-2xl bg-[var(--hover-light)]'>
                {preview.length === 0 && (
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
                                <div className='dropdown absolute top-[-30rem] -left-36 z-50 mt-3'>
                                    <EmojiPicker skinTonePickerLocation='PREVIEW' searchPlaceHolder='Search emojis' lazyLoadEmojis={true} theme='auto' open={showPicker} emojiStyle='native' pickerStyle={{ width: "100%" }} onEmojiClick={onEmojiClick} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <div className='w-full flex flex-col gap-3 mx-4 my-2'>
                    {preview.length > 0 && (
                        preview.length > 1 ? (
                            <div className='flex'>
                                <Carousel showIndicators={false} className='w-full' numVisible={2} numScroll={1} value={preview} itemTemplate={imageTemplate} />
                            </div>
                        ) : (
                            <div className='rounded-xl max-w-32 relative cursor-pointer bg-center bg-no-repeat bg-cover bg-transparent' style={{ backgroundImage: `url(${preview[0].url})` }}>
                                <div className='absolute right-4 top-1'>
                                    <CloseButton onClick={() => { setPreview([]); setMedia([]); fileInputRef.current.value = ''; }} className='bg-[var(--dark-gray)] text-[var(--white)] hover:bg-[var(--hover-dark-gray)]' />
                                </div>
                                <img style={{ visibility: 'hidden' }} src={preview[0].url} />
                            </div>
                        )
                    )}
                    <input value={value} onChange={(e) => { setValue(e.target.value) }} className='p-0 w-full input-outline-remove border-none bg-transparent shadow-transparent outline-none' type='text' name='message' id='message-input' placeholder='Start a new message' />
                </div>
                <div className='text-[var(--blue)] inline-flex'>
                    <IconButton onClick={handleSubmitMessage} className={`${value.length === 0 && preview.length === 0 ? 'text-[var(--hover-lightblue)] cursor-auto' : 'text-[var(--blue)] hover:bg-[var(--hover-lightblue)]'} border-none text-[1.08rem] p-3 `}>
                        <LuSendHorizonal />
                    </IconButton>
                </div>
            </div>
        </aside>
    );
}

export { SearchInput, DragAndDropBox, DragAndDropBox2, TextInput, TextAreaInput, DropdownCheckbox, Dropdown, FloatLabelInput, InputError, ChatInput };