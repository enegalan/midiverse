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

export default function MuteAndBlock({ user = null }) {
    const [hiddenRightNavbar, setHiddenRightNavbar] = useState(false);
    const [activeElement, setActiveElement] = useState('privacity'); // privacity or null
    useEffect(() => {
        localStorage.removeItem('settings_active_link');
    }, [])
    const handleBack = (e) => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem('settings_active_link', 'privacity');
        router.get('/settings/privacity');
    }
    return (
        <>
            <MainLayout user={user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <div className='flex flex-col w-full' >
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
                            <h2 className='font-bold text-xl'>Mute and block</h2>
                        </div>
                        <div className='px-8 mt-6'>
                            <p className='text-[var(--grey)] text-sm'>Manage the accounts and notifications that you have muted or blocked.</p>
                        </div>
                        <div className='mt-6 flex flex-col'>
                            <Link href='/settings/privacity/mute_and_block/blocked_accounts' className='px-8 py-3 transition duration-300 hover:bg-[var(--hover-light)]'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='font-bold text-md'>Blocked accounts</h3>
                                    <div className='text-2xl'><MdKeyboardArrowRight /></div>
                                </div>
                            </Link>
                            <Link href='/settings/privacity/mute_and_block/muted_accounts' className='px-8 py-3 transition duration-300 hover:bg-[var(--hover-light)]'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='font-bold text-md'>Muted accounts</h3>
                                    <div className='text-2xl'><MdKeyboardArrowRight /></div>
                                </div>
                            </Link>
                            <Link href='/settings/privacity/mute_and_block/muted_notifications' className='px-8 py-3 transition duration-300 hover:bg-[var(--hover-light)]'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='font-bold text-md'>Muted notifications</h3>
                                    <div className='text-2xl'><MdKeyboardArrowRight /></div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </RightNavbar>
            </MainLayout>
        </>
    );
}
