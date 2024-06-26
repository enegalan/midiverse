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
import { IoKeyOutline } from "react-icons/io5";
import { TbHeartBroken } from "react-icons/tb";
import { BackButton } from "@/Components/Buttons";
import { isMobile } from "@/Functions";

export default function Account({ user = null }) {
    const [hiddenRightNavbar, setHiddenRightNavbar] = useState(localStorage.getItem('settings_active_link') == 'account' && isMobile() ? false : true);
    const [activeElement, setActiveElement] = useState(localStorage.getItem('settings_active_link') == 'account' || !isMobile() ? 'account' : null); // account or null
    useEffect(() => {
        if (isMobile()) {
            localStorage.removeItem('settings_active_link')
            setActiveElement(null)
        } else {
            localStorage.setItem('settings_active_link', 'account')
            setActiveElement('account')
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
            'id': 'password',
            'name': 'Change your password',
            'subtitle': 'Change your password at any moment.',
            'href': '/settings/account/password',
            'icon': <IoKeyOutline />,
        },
        {
            'id': 'deactivate',
            'name': 'Deactivate your account',
            'subtitle': 'Deactivate your account temporaly, you can revert this action the next time you try to authenticate with this account.',
            'href': '/settings/account/deactivate',
            'icon': <TbHeartBroken/>,
        },
    ];
    return (
        <>
            <MainLayout user={user} headerClassName="backdrop-blur-lg border-b bg-white-900/50 border-blue-950/50" defaultBackgroundColor="transparent" defaultTextColor="var(--main-blue)" dynamicBackground={false}>
                <div className={`${hiddenRightNavbar ? 'flex' : 'hidden lg:flex'} flex-col w-full`} >
                    <section className='pb-16 border-r relative flex-1'>
                        <div className='w-full h-full'>
                            <SettingsNavbar hidden={!hiddenRightNavbar} activeLink={activeElement} onClick={(e) => {setHiddenRightNavbar(!hiddenRightNavbar)}} />
                        </div>
                    </section>
                </div>
                <RightNavbar hideMobile={hiddenRightNavbar} className='w-[70%] lg:w-[40%]' rightBorder={true} setPaddingX={false} minWidth='700px'>
                    <div className='h-screen'>
                        <div className='px-5 flex flex-col gap-5'>
                            <div className='flex items-center gap-6'>
                                <BackButton onClick={handleBack} className='block lg:hidden'/>
                                <h2 className='font-bold text-xl'>Your account</h2>
                            </div>
                            <p className='text-[var(--grey)] text-sm'>Manage your account and privacity or deactivate your account temporaly.</p>
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
