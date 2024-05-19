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

export default function Languages({ user = null }) {
    // TODO: useStates should get their states with user preferences, not with static language value.
    const [currentLanguage, setCurrenLanguage] = useState('English');
    const [hiddenRightNavbar, setHiddenRightNavbar] = useState(false);
    const [activeElement, setActiveElement] = useState('accessibility_display_and_languages'); // accessibility_display_and_languages or null
    const handleDisplayLanguage = (e) => {
        e.preventDefault();
    }
    useEffect(() => {
        localStorage.removeItem('settings_active_link');
    }, [])
    const handleBack = (e) => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem('settings_active_link', 'accessibility_display_and_languages');
        window.location.href = '/settings/accessibility_display_and_languages';
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
                            <h2 className='font-bold text-xl'>Languages</h2>
                        </div>
                        <div className='px-8 mt-6'>
                            <p className='text-[var(--grey)] text-sm'>Manage which languages are used to personalize your MiDiverse experience.</p>
                        </div>
                        <div className='mt-2 flex flex-col gap-2'>
                            <div className='py-4'>
                                <div className='px-8'>
                                    <h2 className='font-bold text-xl'>Display language</h2>
                                    <p className='text-sm text-[var(--grey)] my-4'>Select your preferred language for headlines, buttons, and other text from MiDiverse.</p>
                                </div>
                                <div className='flex flex-col gap-3 mt-2'>
                                    <Link href='language' onClick={handleDisplayLanguage} className={`flex justify-between px-8 py-3 transition duration-300 items-center hover:bg-[var(--hover-light)]`}>
                                        <div className='flex flex-col'>
                                            <span className={`text-md`}>Display language</span>
                                            <span className='text-sm text-[var(--grey)]'>{currentLanguage}</span>
                                        </div>
                                        <div className='text-2xl'><MdKeyboardArrowRight /></div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </RightNavbar>
            </MainLayout>
        </>
    );
}
