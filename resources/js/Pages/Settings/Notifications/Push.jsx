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

export default function Push({ user = null }) {
    const [pushEnabled, setPushEnabled] = useState(false);
    const [hiddenRightNavbar, setHiddenRightNavbar] = useState(false);
    const [activeElement, setActiveElement] = useState('notifications'); // notifications or null
    const handlePushToggle = (e) => {
        e.preventDefault();
        setPushEnabled(!pushEnabled);
    }
    useEffect(() => {
        localStorage.removeItem('settings_active_link');
    }, [])
    const handleBack = (e) => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem('settings_active_link', 'notifications');
        router.get('/settings/notifications');
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
                            <h2 className='font-bold text-xl'>Push notifications</h2>
                        </div>
                        <div className='px-8 mt-6' onClick={handlePushToggle}>
                            <div className='pointer-events-none flex justify-between items-center'>
                                <h2>Push notifications</h2>
                                <InputSwitch checked={pushEnabled} onClick={handlePushToggle} />
                            </div>
                            <p className='text-[var(--grey)] text-sm'>Get push notifications to find out what’s going on when you are not on MiDiverse. You can turn them off anytime.</p>
                        </div>
                        <div className='mt-12 flex flex-col gap-2 px-24'>
                            <h1 className='font-bold text-3xl text-wrap pr-12'>Turn on push notifications</h1>
                            <span className='text-[var(--grey)] text-sm'>To receive notifications as they happen, turn on push notifications. You’ll also receive them when you’re not on MiDiverse. Turn them off anytime.</span>
                            <div className='mt-6'>
                                <AuthButton text='Turn on' className='bg-[var(--main-blue)] text-lg text-white transition duration-300 hover:bg-[var(--hover-blue)]' />
                            </div>
                        </div>
                    </div>
                </RightNavbar>
            </MainLayout>
        </>
    );
}
