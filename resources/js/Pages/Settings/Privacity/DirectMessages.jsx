import MainLayout from "@/Layouts/mainLayout";
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import RightNavbar from "@/Components/Navbars/RightNavbar";
import SettingsNavbar from "@/Components/Navbars/SettingsNavbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi2";
import { BiVolumeMute } from "react-icons/bi";
import { BackButton } from "@/Components/Buttons";
import { isMobile } from "@/Functions";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { RadioButton } from "@/Components/Buttons";
import { Checkbox } from "@/Components/Buttons";
import { router } from "@inertiajs/react";

export default function DirectMessages({ user = null }) {
    const [hiddenRightNavbar, setHiddenRightNavbar] = useState(localStorage.getItem('settings_active_link') == 'privacity' && isMobile() ? false : true);
    const [activeElement, setActiveElement] = useState(localStorage.getItem('settings_active_link') == 'privacity' || !isMobile() ? 'privacity' : null); // privacity or null
    const [allowedNoOne, setAllowedNoOne] = useState(user.allowed_message_requests == 0 ? true : false); // Should be get from user
    const [allowedEveryone, setAllowedEveryone] = useState(user.allowed_message_requests == 1 ? true : false); // Should be get from user
    const [readReceipts, setReadReceipts] = useState(user.read_receipts); // Should be get from user
    useEffect(() => {
        localStorage.removeItem('settings_active_link');
    }, [])
    const handleBack = (e) => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem('settings_active_link', 'privacity');
        router.get('/settings/privacity');
    }
    const handleNoOne = (e) => {
        setAllowedEveryone(false)
        setAllowedNoOne(!allowedNoOne)
        axios.post('/user/set/allowed_message_requests');
    }
    const handleEveryone = (e) => {
        setAllowedNoOne(false)
        setAllowedEveryone(!allowedEveryone)
        axios.post('/user/set/allowed_message_requests');
    }
    const handleShowReadReceipts = (e) => {
        setReadReceipts(!readReceipts);
        axios.post('/user/set/read_receipts');
    }
    return (
        <>
            <MainLayout user={user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <div className={`${hiddenRightNavbar ? 'flex' : 'hidden lg:flex'} flex-col w-full`} >
                    <section className="pb-16 border-r relative flex-1">
                        <div className="w-full h-full">
                            <SettingsNavbar hidden={!hiddenRightNavbar} activeLink={activeElement} onClick={(e) => { setHiddenRightNavbar(!hiddenRightNavbar) }} />
                        </div>
                    </section>
                </div>
                <RightNavbar hideMobile={hiddenRightNavbar} className='w-[70%] lg:w-[40%]' rightBorder={true} setPaddingX={false} setPaddingY={false} minWidth='700px'>
                    <div className='h-screen'>
                        <div className='px-2 py-1 flex gap-6 mb-2 items-center'>
                            <BackButton onClick={handleBack} />
                            <h2 className='font-bold text-xl'>Direct Messages</h2>
                        </div>
                        <div className='flex flex-col mx-5 pt-3'>
                            <h3 className='text-sm font-bold'>Allow message requests from:</h3>
                            <p className='text-xs text-[var(--grey)]'>People you follow or follows you will always be able to message you.</p>
                            <div className='flex flex-col gap-3 my-4'>
                                <div onClick={handleNoOne} className='flex items-center justify-between cursor-pointer'>
                                    <span className='text-sm'>No one</span>
                                    <RadioButton readOnly={true} checked={allowedNoOne} className='cursor-pointer'/>
                                </div>
                                <div onClick={handleEveryone} className='flex items-center justify-between cursor-pointer'>
                                    <span className='text-sm'>Everyone</span>
                                    <RadioButton readOnly={true} checked={allowedEveryone} className='cursor-pointer pointer-events-none'/>
                                </div>
                            </div>
                        </div>
                        <div className='border-t'>
                            <div className='flex flex-col gap-3 mt-4 mx-5'>
                                <div onClick={handleShowReadReceipts} className={`flex flex-col justify-between py-2 cursor-pointer`}>
                                    <div className='flex justify-between items-center'>
                                        <span className={`text-md`}>Show read receipts</span>
                                        <Checkbox checked={readReceipts} onChange={handleShowReadReceipts} />
                                    </div>
                                    <span className='text-xs text-[var(--grey)]'>Let people you’re messaging with know when you’ve seen their messages. Read receipts are not shown on message requests.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </RightNavbar>
            </MainLayout>
        </>
    );
}
