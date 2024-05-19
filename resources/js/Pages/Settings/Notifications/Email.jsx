import MainLayout from "@/Layouts/mainLayout";
import { SearchInput } from "@/Components/Inputs";
import { AuthButton, BackButton, FollowButton } from "@/Components/Buttons";
import { useState, useEffect } from "react";
import PostCard from "@/Components/Cards/PostCard";
import { IconButton } from "@/Components/Buttons";
import { Link } from "@inertiajs/react";
import RightNavbar from "@/Components/Navbars/RightNavbar";
import SettingsNavbar from "@/Components/Navbars/SettingsNavbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import { TbHeartBroken } from "react-icons/tb";
import PeopleCard from "@/Components/Cards/PeopleCard";
import { Checkbox } from "@/Components/Buttons";
import { InputSwitch } from 'primereact/inputswitch';

export default function Email({ user = null }) {
    // TODO: useStates should get their states with user preferences, not with static boolean values.
    const [emailEnabled, setEmailEnabled] = useState(false);
    const [newNotifications, setNewNotifications] = useState(false);
    const [directMessages, setDirectMessages] = useState(false);
    const [concerts, setConcerts] = useState(false);
    const [groups, setGroups] = useState(false);
    const [hiddenRightNavbar, setHiddenRightNavbar] = useState(false);
    const [activeElement, setActiveElement] = useState('notifications'); // notifications or null
    const handleEmailToggle = (e) => {
        e.preventDefault();
        setEmailEnabled(!emailEnabled);
    }
    const handleNewNotificationsToggle = (e) => {
        e.preventDefault();
        if (!emailEnabled) return;
        setNewNotifications(!newNotifications);
    }
    const handleDirectMessagesToggle = (e) => {
        e.preventDefault();
        if (!emailEnabled) return;
        setDirectMessages(!directMessages);
    }
    const handleConcertsToggle = (e) => {
        e.preventDefault();
        if (!emailEnabled) return;
        setConcerts(!concerts);
    }
    const handleGroupsToggle = (e) => {
        e.preventDefault();
        if (!emailEnabled) return;
        setGroups(!groups);
    }
    useEffect(() => {
        localStorage.removeItem('settings_active_link');
    }, [])
    const handleBack = (e) => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem('settings_active_link', 'notifications');
        window.location.href = '/settings/notifications';
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
                <RightNavbar hideMobile={hiddenRightNavbar} className='w-[70%] lg:w-[40%]' rightBorder={true} setPaddingX={false} minWidth='700px'>
                    <div className='h-screen'>
                        <div className='px-5 flex gap-8 mb-2 items-center'>
                            <BackButton onClick={handleBack} />
                            <h2 className='font-bold text-xl'>Email notifications</h2>
                        </div>
                        <div className='px-8 mt-6' onClick={handleEmailToggle}>
                            <div className='pointer-events-none flex justify-between items-center'>
                                <h2>Email notifications</h2>
                                <InputSwitch checked={emailEnabled} onClick={handleEmailToggle} />
                            </div>
                            <p className='text-[var(--grey)] text-sm'>Get emails to find out what’s going on when you’re not on MiDiverse. You can turn them off anytime. </p>
                        </div>
                        <div className='mt-12 flex flex-col gap-2'>
                            <div className='border-t px-8 py-4'>
                                <h2 className='font-bold text-xl'>Related to you and your posts</h2>
                                <div className='flex flex-col gap-3 mt-6'>
                                    <div onClick={handleNewNotificationsToggle} className={`flex justify-between py-2 items-center ${emailEnabled && 'hover:cursor-pointer'}`}>
                                        <span className={`${!emailEnabled ? 'text-[var(--grey)] cursor-default' : 'text-black'} `}>New notifications</span>
                                        <Checkbox checked={newNotifications} disabled={!emailEnabled} onClick={handleNewNotificationsToggle} />
                                    </div>
                                    <div onClick={handleDirectMessagesToggle} className={`flex justify-between py-2 items-center ${emailEnabled && 'hover:cursor-pointer'}`}>
                                        <span className={`${!emailEnabled ? 'text-[var(--grey)] cursor-default' : 'text-black'} `}>Direct messages</span>
                                        <Checkbox checked={directMessages} disabled={!emailEnabled} onClick={handleDirectMessagesToggle} />
                                    </div>
                                    <div onClick={handleConcertsToggle} className={`flex justify-between py-2 items-center ${emailEnabled && 'hover:cursor-pointer'}`}>
                                        <span className={`${!emailEnabled ? 'text-[var(--grey)] cursor-default' : 'text-black'} `}>Concerts news</span>
                                        <Checkbox checked={concerts} disabled={!emailEnabled} onClick={handleConcertsToggle} />
                                    </div>
                                    <div onClick={handleGroupsToggle} className={`flex justify-between py-2 items-center ${emailEnabled && 'hover:cursor-pointer'}`}>
                                        <span className={`${!emailEnabled ? 'text-[var(--grey)] cursor-default' : 'text-black'} `}>Group news</span>
                                        <Checkbox checked={groups} disabled={!emailEnabled} onClick={handleGroupsToggle} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </RightNavbar>
            </MainLayout>
        </>
    );
}
