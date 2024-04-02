import logoWhite from "../../../../public/logoWhite.svg";
import logoBlack from "../../../../public/logoBlack.svg";
import Dropdown from "@/Components/Dropdown";

/* Icons */
import { GoHome } from "react-icons/go";
import { GoHomeFill } from "react-icons/go";

import { GoSearch } from "react-icons/go";

import { IoMusicalNotesOutline } from "react-icons/io5";
import { IoMusicalNotes } from "react-icons/io5";

import { IoMdNotificationsOutline } from "react-icons/io";
import { IoMdNotifications } from "react-icons/io";

import { AiOutlineMessage } from "react-icons/ai";
import { AiFillMessage } from "react-icons/ai";

import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";

import { FaRegUser } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

import { IoSettingsOutline } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";

import { MdOutlinePiano } from "react-icons/md";


import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Link } from "@inertiajs/react";

import { Avatar } from "primereact/avatar";

const Navbar = ({
    user = null,
    className = "",
}) => {
    var isAdmin = false;

    if (user && user.hasOwnProperty('roles')) isAdmin = user.roles.some(role => role.name === 'admin');

    var userInitials = user.name[0].toUpperCase();
    if (user.hasOwnProperty('lastname') && user.lastname && user.lastname.length > 0) {
        userInitials += user.lastname[0].toUpperCase();
    }

    const [webRef, setWebRef] = useState(localStorage.getItem('web-ref') ? localStorage.getItem('web-ref') : 'home');

    const iconWidth = '26.5px';

    const onLinkClick = (e) => {
        var dataRef = e.target.getAttribute('data-ref');
        if (dataRef !== null) setWebRef(dataRef);
        localStorage.setItem('web-ref', dataRef);
    }

    const [isLogoutModal, setIsLogoutModal] = useState(false);

    const toggleLogoutModal = () => {
        setIsLogoutModal(!isLogoutModal);
    }

    // Close all dropdowns when click on outside a dropdown
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
                setIsLogoutModal(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isLogoutModal]);

    const handleLogout = (e) => {
        console.log('hello');
        try {
            axios.get('/logout')
        } catch (error) {
            console.error(error)
        }
    }

    const menuLinks = [
        {
            title: 'Home',
            href: '/',
            id: 'home',
            ref: 'home',
            icon: <GoHome className={`text-[${iconWidth}]`} />,
            activeIcon: <GoHomeFill className={`text-[${iconWidth}]`} />,
        },
        {
            title: 'Explore',
            href: '/explore',
            id: 'explore',
            ref: 'explore',
            icon: <GoSearch className={`text-[${iconWidth}]`} />,
            activeIcon: <GoSearch className={`text-[${iconWidth}] stroke-1`} />,
        },
        {
            title: 'Concerts',
            href: '/concerts',
            id: 'concerts',
            ref: 'concerts',
            icon: <IoMusicalNotesOutline className={`text-[${iconWidth}]`} />,
            activeIcon: <IoMusicalNotes className={`text-[${iconWidth}]`} />,
        },
        {
            title: 'Notifications',
            href: '/',
            id: 'notifications',
            ref: 'notifications',
            icon: <IoMdNotificationsOutline className={`text-[${iconWidth}]`} />,
            activeIcon: <IoMdNotifications className={`text-[${iconWidth}]`} />,
        },
        {
            title: 'Messages',
            href: '/messages',
            id: 'messages',
            ref: 'messages',
            icon: <AiOutlineMessage className={`text-[${iconWidth}]`} />,
            activeIcon: <AiFillMessage className={`text-[${iconWidth}]`} />,
        },
        {
            title: 'Bookmarks',
            href: '/',
            id: 'bookmarks',
            ref: 'bookmarks',
            icon: <FaRegBookmark className={`text-[23px] ml-[2px]`} />,
            activeIcon: <FaBookmark className={`text-[23px] ml-[2px]`} />,
        },
        {
            title: 'Profile',
            href: '/',
            id: 'profile',
            ref: 'profile',
            icon: <FaRegUser className={`text-[22px] ml-[2px]`} />,
            activeIcon: <FaUser className={`text-[22px] ml-[2px]`} />,
        },
        {
            title: 'Settings',
            href: '/',
            id: 'settings',
            ref: 'settings',
            icon: <IoSettingsOutline className={`text-[24px] ml-[2px]`} />,
            activeIcon: <IoSettingsSharp className={`text-[24px] ml-[2px]`} />,
        },
    ];

    const mobileMainLinks = [
        {
            title: 'Home',
            href: '/',
            id: 'm-home',
            ref: 'home',
            icon: '',
            activeIcon: '',
        },
        {
            title: 'Explore',
            href: '/',
            id: 'm-explore',
            ref: 'explore',
            icon: '',
            activeIcon: '',
        },
        {
            title: 'Notifications',
            href: '/',
            id: 'm-notifications',
            ref: 'notifications',
            icon: '',
            activeIcon: '',
        },
        {
            title: 'Messages',
            href: '/messages',
            id: 'm-messages',
            ref: 'messages',
            icon: '',
            activeIcon: '',
        },
    ];

    const mobileLinks = [
        {
            title: 'Profile',
            href: '/',
            id: 'm-profile',
            ref: 'profile',
            icon: '',
            activeIcon: '',
        },
        {
            title: 'Concerts',
            href: '/',
            id: 'm-concerts',
            ref: 'concerts',
            icon: '',
            activeIcon: '',
        },
        {
            title: 'Bookmarks',
            href: '/',
            id: 'm-bookmarks',
            ref: 'bookmarks',
            icon: '',
            activeIcon: '',
        },
        {
            title: 'Settings',
            href: '/',
            id: 'm-settings',
            ref: 'settings',
            icon: '',
            activeIcon: '',
        },
        {
            title: 'Log out',
            href: '/',
            id: 'm-logout',
            ref: 'logout',
            icon: '',
            activeIcon: '',
        },
    ];

    return (
        <>
            <header
                className={`min-w-[118px] xl:min-w-[350px] items-baseline xl:items-end flex flex-col flex-wrap py-4 px-10 h-full justify-between text-black left-0 z-30 bg-white transition ease-in-out duration-500 ` + className}
            >
                <div className="fixed">
                    <div className="xl:pl-[1.35rem] pl-[0.3rem] flex flex-col flex-1 gap-5 items-start">
                        {/* Logo */}
                        <Link
                            onClick={onLinkClick}
                            href='/home'
                            data-ref='home'
                            className="text-4xl mb-4 font-bold justify-center flex gap-8 self-center"
                        >
                            <img className="w-10 pointer-events-none" src={logoBlack} alt="Logo" />
                        </Link>
                    </div>
                    <div className="flex-1 justify-center flex">
                        {/* Menu links */}
                        <ul className="justify-center flex flex-col xl:[&>li]:px-4 xl:gap-2">
                            {menuLinks.map((link) => (
                                <li data-ref={link.ref} className="xl:px-1 transition rounded-full self-center hover:bg-gray-300 w-full" key={link.id}>
                                    <Link
                                        onClick={onLinkClick}
                                        href={link.href}
                                        data-ref={link.ref}
                                        className="p-3 xl:p-3 text-lg flex items-center justify-center xl:justify-start xl:items-center gap-3"
                                    >
                                        <div className='pointer-events-none'>
                                            {webRef === link.ref ? link.activeIcon : link.icon}
                                        </div>
                                        <span data-ref={link.ref} className={`hidden xl:block ${webRef === link.ref ? 'font-bold' : ''}`}>{link.title}</span>
                                    </Link>
                                </li>
                            ))}
                            <a
                                onClick={onLinkClick}
                                data-ref='playground'
                                href={route('playground')}
                                className={`my-3 text-center rounded-full xl:px-16 self-center block xl:p-4 p-4 text-lg border-2 border-[var(--blue)] transition hover:bg-[var(--main-blue)] hover:text-white ${webRef === 'playground' ? 'bg-[var(--blue)] text-white' : 'bg-transparent text-[var(--blue)]'}`}
                            >
                                <MdOutlinePiano className="text-2xl block xl:hidden" />
                                <span className="hidden xl:block font-bold">Playground</span>
                            </a>
                        </ul>
                    </div>
                    <div className="absolute mt-24 flex-1 flex justify-center items-center">
                        {user.avatar ? (
                            <span onClick={toggleLogoutModal} className='px-2 py-2 flex justify-center items-center transition rounded-full hover:cursor-pointer hover:bg-gray-300 w-full"'>
                                <Avatar image={user.avatar} size="large" shape="circle" />
                            </span>
                        ) : (
                            <span onClick={toggleLogoutModal} className='px-2 py-2 flex justify-center items-center transition rounded-full hover:cursor-pointer hover:bg-gray-300 w-full"'>
                                <Avatar label={userInitials} size="large" shape="circle" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} />
                            </span>
                        )}
                        {isLogoutModal ? (
                            <section className='dropdown absolute top-3 left-0'>
                                <div className='absolute -top-20 left-4 min-w-[150px] bg-white rounded-lg shadow py-2'>
                                    <div className='flex flex-col gap-2'>
                                        <Link href={route('logout')} className='font-bold px-4 py-2 hover:bg-[var(--hover-light)]'>Log out</Link>
                                    </div>
                                </div>
                                <div className="absolute -top-6 left-6 w-5 flex justify-center overflow-hidden">
                                    <div className="shadow h-3 w-3 bg-white -rotate-45 transform origin-top-left"></div>
                                </div>
                            </section>
                        ) : (<></>)}
                    </div>
                </div>
            </header>
        </>
    );
};
Navbar.propTypes = {

};

export default Navbar;
