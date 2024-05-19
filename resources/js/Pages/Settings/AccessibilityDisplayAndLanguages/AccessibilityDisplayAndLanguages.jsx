import MainLayout from "@/Layouts/mainLayout";
import { SearchInput } from "@/Components/Inputs";
import { AuthButton, FollowButton } from "@/Components/Buttons";
import { useState, useEffect } from "react";
import PostCard from "@/Components/Cards/PostCard";
import { IconButton } from "@/Components/Buttons";
import { Link } from "@inertiajs/react";
import RightNavbar from "@/Components/Navbars/RightNavbar";
import SettingsNavbar from "@/Components/Navbars/SettingsNavbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaRegEyeSlash } from "react-icons/fa";
import { HiOutlinePaintBrush } from "react-icons/hi2";
import { IoEarthOutline } from "react-icons/io5";
import { BackButton } from "@/Components/Buttons";
import { isMobile } from "@/Functions";

export default function AccessibilityDisplayAndLanguages({ user = null }) {
    const [hiddenRightNavbar, setHiddenRightNavbar] = useState(localStorage.getItem('settings_active_link') == 'accessibility_display_and_languages' && isMobile() ? false : true);
    const [activeElement, setActiveElement] = useState(localStorage.getItem('settings_active_link') == 'accessibility_display_and_languages' || !isMobile() ? 'accessibility_display_and_languages' : null); // accessibility_display_and_languages or null
    useEffect(() => {
        if (isMobile()) {
            localStorage.removeItem('settings_active_link')
            setActiveElement(null)
        } else {
            localStorage.setItem('settings_active_link', 'accessibility_display_and_languages')
            setActiveElement('accessibility_display_and_languages')
        }
    }, []);
    const handleBack = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setHiddenRightNavbar(!hiddenRightNavbar);
        setActiveElement(null);
        localStorage.removeItem('settings_active_link');
    }
    const links = [
        {
            'id': 'accessibility',
            'name': 'Accessibility',
            'href': 'accessibility_display_and_languages/accessibility',
            'icon': <FaRegEyeSlash />,
        },
        {
            'id': 'display',
            'name': 'Display',
            'href': 'accessibility_display_and_languages/display',
            'icon': <HiOutlinePaintBrush />,
        },
        {
            'id': 'languages',
            'name': 'Languages',
            'href': 'accessibility_display_and_languages/languages',
            'icon': <IoEarthOutline />,
        },
    ];
    return (
        <>
            <MainLayout user={user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <div className={`${hiddenRightNavbar ? 'flex' : 'hidden lg:flex'} flex-col w-full`} >
                    <section className="pb-16 border-r relative flex-1">
                        <section className="pb-16 border-r relative flex-1">
                            <div className="w-full h-full">
                                <SettingsNavbar hidden={!hiddenRightNavbar} activeLink={activeElement} onClick={(e) => { setHiddenRightNavbar(!hiddenRightNavbar) }} />
                            </div>
                        </section>
                    </section>
                </div>
                <RightNavbar hideMobile={hiddenRightNavbar} className='w-[70%] lg:w-[40%]' rightBorder={true} setPaddingX={false} minWidth='700px'>
                    <div className='h-screen'>
                        <div className='px-5 flex flex-col gap-5'>
                            <div className='flex items-center gap-6'>
                                <BackButton onClick={handleBack} className='block lg:hidden' />
                                <h2 className='font-bold text-xl'>Accessibility, display and languages</h2>
                            </div>
                            <p className='text-[var(--grey)] text-sm'>Manage how MiDiverse content is displayed to you.</p>
                        </div>
                        <ul className='mt-6'>
                            {links.map(link => {
                                return (
                                    <li key={link.id} id={link.id} className='w-full'>
                                        <Link className='flex items-center justify-between px-5 py-5 transition duration-300 hover:bg-[var(--hover-light)]' href={link.href}>
                                            <div className='flex gap-4'>
                                                <div className='flex items-center text-[var(--grey)]'>
                                                    {link.icon}
                                                </div>
                                                <div className='flex flex-col'>
                                                    <span>{link.name}</span>
                                                    <div><p className='text-[var(--grey)] text-sm'>{link.subtitle}</p></div>
                                                </div>
                                            </div>
                                            <div className='text-2xl'><MdKeyboardArrowRight /></div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </RightNavbar>
            </MainLayout>
        </>
    );
}
