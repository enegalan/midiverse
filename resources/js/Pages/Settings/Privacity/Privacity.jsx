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

export default function Privacity({ user = null }) {
    const [hiddenRightNavbar, setHiddenRightNavbar] = useState(localStorage.getItem('settings_active_link') == 'privacity' && isMobile() ? false : true);
    const [activeElement, setActiveElement] = useState(localStorage.getItem('settings_active_link') == 'privacity' || !isMobile() ? 'privacity' : null); // privacity or null
    useEffect(() => {
        if (isMobile()) {
            localStorage.removeItem('settings_active_link')
            setActiveElement(null)
        } else {
            localStorage.setItem('settings_active_link', 'privacity')
            setActiveElement('privacity')
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
            'id': 'audience_and_media',
            'name': 'Audience and media',
            'subtitle': 'Manage what information you allow other users on MiDiverse to see.',
            'href': 'audience_and_media',
            'icon': <HiOutlineUsers />,
        },
        {
            'id': 'mute_and_block',
            'name': 'Mute and block',
            'subtitle': 'Manage the accounts that you have muted or blocked.',
            'href': 'mute_and_block',
            'icon': <BiVolumeMute />,
        },
        {
            'id': 'direct_messages',
            'name': 'Direct Messages',
            'subtitle': 'Manage who can message you directly',
            'href': 'direct_messages',
            'icon': <IoChatbubbleEllipsesOutline />,
        },
    ];
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
                    <div className='px-5 flex flex-col gap-5'>
                        <div className='flex items-center gap-6'>
                            <BackButton onClick={handleBack} className='block lg:hidden'/>
                            <h2 className='font-bold text-xl'>Privacity</h2>
                        </div>
                        <p className='text-[var(--grey)] text-sm'>Manage what information you see and share on MiDiverse.</p>
                    </div>
                    <ul className='mt-6'>
                        {links.map(link => {
                            return (
                                <li key={link.id} id={link.id} className='w-full'>
                                    <Link className='flex items-center justify-between px-5 py-5 transition duration-300 hover:bg-[var(--hover-light)]' href={'/settings/privacity/' + link.href}>
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
